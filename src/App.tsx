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
  'bg-rose-500'
]

const ICONS = ['👤', '🧑', '👩', '🧔', '👱', '🧑‍💻', '👨‍💼', '👩‍💼', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍⚕️']

function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [newName, setNewName] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

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
        icon: getRandomIcon()
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
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * people.length)
      setSelectedPerson(people[randomIndex])
      setIsShuffling(false)
      
      setTimeout(() => {
        setShowResult(true)
      }, 100)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPerson()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Left Column - Names List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Names</h2>
        
        {/* Add Name Input */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter a name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={addPerson} size="icon" aria-label="Plus">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Names List */}
        <div className="space-y-2">
          {people.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No names added yet</p>
          ) : (
            people.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors animate-fade-in"
              >
                <div className={`w-8 h-8 ${person.color} rounded-full flex items-center justify-center text-white text-sm`}>
                  {person.icon}
                </div>
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{person.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePerson(person.id)}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
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
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Name Shuffle</h1>
          
          {/* Selected Person Display */}
          <div className="h-64 flex items-center justify-center">
            {isShuffling ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-4xl animate-spin-slow mb-4">
                  🎲
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-400">Shuffling...</p>
              </div>
            ) : selectedPerson && showResult ? (
              <div className="text-center animate-bounce-in">
                <div className={`w-24 h-24 ${selectedPerson.color} rounded-full flex items-center justify-center text-4xl mb-4 mx-auto`}>
                  {selectedPerson.icon}
                </div>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{selectedPerson.name}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl mb-4 mx-auto">
                  👤
                </div>
                <p className="text-xl">Press shuffle to pick a name!</p>
              </div>
            )}
          </div>

          {/* Shuffle Button */}
          <Button
            onClick={shufflePerson}
            disabled={people.length === 0 || isShuffling}
            size="lg"
            className="text-xl px-8 py-4 h-auto bg-blue-600 hover:bg-blue-700"
          >
            <Shuffle className="h-6 w-6 mr-2" />
            {isShuffling ? 'Shuffling...' : 'Shuffle!'}
          </Button>

          {people.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-lg">Add some names to get started</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App