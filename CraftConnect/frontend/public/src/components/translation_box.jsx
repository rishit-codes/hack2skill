'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Globe, Languages, Copy, Download, ArrowRight, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

export default function TranslationBox() {
  const { isDarkMode } = useTheme()
  const [sourceText, setSourceText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  const languages = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  ]

  const handleTranslate = async () => {
    if (!sourceText.trim()) return
    
    setIsTranslating(true)
    
    // Simulate translation
    setTimeout(() => {
      const selectedLang = languages.find(lang => lang.code === targetLanguage)
      setTranslatedText(`[Translated to ${selectedLang?.name}]\n\n${sourceText}\n\n(This is a simulated translation. In a real application, this would be translated using AI translation services.)`)
      setIsTranslating(false)
    }, 2000)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <motion.button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-orange-400 hover:bg-gray-800' 
                    : 'text-orange-700 hover:bg-orange-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </motion.button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
          }`}>Translate & Share</h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Reach global audiences in their language</p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
              : 'bg-white/90 backdrop-blur-sm border-orange-100'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>
                <Languages className="h-5 w-5" />
                <span>Language Selection</span>
              </CardTitle>
              <CardDescription className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Choose your target language for translation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => setTargetLanguage(language.code)}
                    className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                      targetLanguage === language.code
                        ? isDarkMode
                          ? 'border-orange-500 bg-orange-600/20 text-orange-400'
                          : 'border-orange-500 bg-orange-50 text-orange-700'
                        : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-300'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{language.flag}</div>
                    <div className={`text-sm font-medium transition-colors duration-300 ${
                      targetLanguage === language.code && isDarkMode 
                        ? 'text-orange-400' 
                        : targetLanguage === language.code 
                          ? 'text-orange-700'
                          : isDarkMode 
                            ? 'text-gray-300' 
                            : 'text-gray-700'
                    }`}>{language.name}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Translation Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Text */}
            <Card className={`transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
                : 'bg-white/90 backdrop-blur-sm border-orange-100'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🇺🇸</span>
                    <span>English</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(sourceText)} className={`transition-colors duration-300 ${
                    isDarkMode 
                      ? 'border-gray-600 text-orange-400 hover:bg-gray-700' 
                      : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                  }`}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter your product description, story, or any text you'd like to translate..."
                  rows={12}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {sourceText.length} characters
                  </span>
                  <Button
                    onClick={handleTranslate}
                    disabled={isTranslating || !sourceText.trim()}
                    className={`transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {isTranslating ? (
                      <>
                        <Globe className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        Translate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Translated Text */}
            <Card className={`transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
                : 'bg-white/90 backdrop-blur-sm border-orange-100'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {languages.find(lang => lang.code === targetLanguage)?.flag}
                    </span>
                    <span>{languages.find(lang => lang.code === targetLanguage)?.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(translatedText)} className={`transition-colors duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 text-orange-400 hover:bg-gray-700' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    }`}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className={`transition-colors duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 text-orange-400 hover:bg-gray-700' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    }`}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isTranslating ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className={`h-4 rounded w-full mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-5/6 mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-4/6 mb-4 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-full mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded w-3/4 mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                    <p className={`text-sm text-center transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Translating your text...
                    </p>
                  </div>
                ) : translatedText ? (
                  <div>
                    <div className={`p-4 rounded-lg h-64 overflow-y-auto transition-colors duration-300 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <p className={`leading-relaxed whitespace-pre-line transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {translatedText}
                      </p>
                    </div>
                    <div className={`mt-4 text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Translation completed
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Globe className={`h-12 w-12 mx-auto mb-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-300'
                    }`} />
                    <p className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Your translated text will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Translation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className={`transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
              : 'bg-white/90 backdrop-blur-sm border-orange-100'
          }`}>
            <CardHeader>
              <CardTitle className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>Translation Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    isDarkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                  }`}>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>1</span>
                  </div>
                  <div>
                    <h4 className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Keep it Simple</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Use clear, simple language for better translations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    isDarkMode ? 'bg-green-600/20' : 'bg-green-100'
                  }`}>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>2</span>
                  </div>
                  <div>
                    <h4 className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Cultural Context</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Consider cultural nuances for your target audience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    isDarkMode ? 'bg-purple-600/20' : 'bg-purple-100'
                  }`}>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>3</span>
                  </div>
                  <div>
                    <h4 className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>Review & Edit</h4>
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Always review translations before publishing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}