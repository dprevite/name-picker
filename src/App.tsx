import { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Plus, Shuffle, Trash2 } from 'lucide-react'
import { ThemeToggle } from './components/ThemeToggle'

interface Person {
  id: string
  name: string
  color: string
  icon: string
}

const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-rose-500',
]

const ICONS = ['👤', '🧑', '👩', '🧔', '👱', '🧑‍💻', '👨‍💼', '👩‍💼', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍⚕️']

function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [newName, setNewName] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [shufflingIcon, setShufflingIcon] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nameShuffle-people')
      if (saved) {
        const parsedPeople = JSON.parse(saved)
        setPeople(parsedPeople)
      }
    } catch (error) {
      console.warn('Failed to load names from localStorage:', error)
    } finally {
      setHasLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('nameShuffle-people', JSON.stringify(people))
    }
  }, [people, hasLoaded])

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]
  const getRandomIcon = () => ICONS[Math.floor(Math.random() * ICONS.length)]

  const addPerson = () => {
    if (newName.trim()) {
      const newPerson: Person = {
        id: crypto.randomUUID(),
        name: newName.trim(),
        color: getRandomColor(),
        icon: getRandomIcon(),
      }
      setPeople([...people, newPerson])
      setNewName('')
    }
  }

  const removePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id))
    if (selectedPerson?.id === id) {
      setSelectedPerson(null)
      setShowResult(false)
    }
  }

  const shufflePerson = () => {
    if (people.length === 0) return

    setIsShuffling(true)
    setShowResult(false)

    // Create array of all user icons mixed with emoji icons
    const allIcons = [...people.map(p => p.icon), ...ICONS]
    let iconIndex = 0

    // Cycle through icons during shuffle
    const iconInterval = setInterval(() => {
      setShufflingIcon(allIcons[iconIndex % allIcons.length])
      iconIndex++
    }, 100) // Change icon every 100ms

    setTimeout(() => {
      clearInterval(iconInterval)
      const randomIndex = Math.floor(Math.random() * people.length)
      setSelectedPerson(people[randomIndex])
      // Set both states simultaneously to avoid flash
      setIsShuffling(false)
      setShowResult(true)
      setShufflingIcon('')
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPerson()
    }
  }

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left Column - Names List */}
      <div className="w-80 bg-card border-r border-border p-6 relative">
        {/* Background effect for sidebar */}
        {selectedPerson && showResult && (
          <div
            className={`absolute inset-0 ${selectedPerson.color} opacity-15 transition-opacity duration-500`}
          ></div>
        )}
        {/* Add Name Input */}
        <div className="flex gap-2 mb-6 relative z-10">
          <Input
            placeholder="Enter a name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button onClick={addPerson} size="icon" aria-label="Plus" className="cursor-pointer">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Names List */}
        <div className="space-y-2 relative z-10">
          {people.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No names added yet</p>
          ) : (
            people.map(person => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-accent transition-colors animate-fade-in"
              >
                <div
                  className={`w-8 h-8 ${person.color} rounded-full flex items-center justify-center text-white text-sm`}
                >
                  {person.icon}
                </div>
                <span className="flex-1 font-medium text-secondary-foreground">{person.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePerson(person.id)}
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                  aria-label="Trash"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area - Shuffle */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Background effect */}
        {selectedPerson && showResult && (
          <div
            className={`absolute inset-0 ${selectedPerson.color} opacity-10 transition-opacity duration-500`}
          ></div>
        )}
        <div className="text-center space-y-16 relative z-10">
          {/* Selected Person Display */}
          <div className="flex items-center justify-center">
            {isShuffling ? (
              <div className="text-center">
                <div className="w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 bg-muted rounded-full flex items-center justify-center text-7xl md:text-8xl lg:text-9xl animate-spin-slow shadow-2xl">
                  {shufflingIcon || '🎲'}
                </div>
              </div>
            ) : selectedPerson && showResult ? (
              <div className="text-center relative">
                <div
                  className={`w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 ${selectedPerson.color} rounded-full flex items-center justify-center text-7xl md:text-8xl lg:text-9xl mx-auto shadow-2xl animate-bounce-and-grow-debug relative z-10`}
                >
                  {selectedPerson.icon}
                </div>
                <p
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-35 text-4xl md:text-5xl lg:text-6xl font-bold ${selectedPerson.color.replace('bg-', 'text-')} z-20 animate-bounce-in drop-shadow-2xl`}
                >
                  {selectedPerson.name}
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 bg-muted rounded-full flex items-center justify-center text-7xl md:text-8xl lg:text-9xl mx-auto opacity-30">
                  👤
                </div>
              </div>
            )}
          </div>

          {/* Shuffle Button */}
          <Button
            onClick={shufflePerson}
            disabled={people.length === 0 || isShuffling}
            size="lg"
            className="mt-30 text-xl px-8 py-4 h-auto bg-blue-600 hover:bg-blue-700 text-white disabled:text-white font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 disabled:opacity-50"
          >
            <Shuffle className="h-6 w-6 mr-2" />
            {isShuffling ? 'Shuffling...' : 'Shuffle!'}
          </Button>

          {people.length === 0 && (
            <p className="text-muted-foreground text-lg">Add some names to get started</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
