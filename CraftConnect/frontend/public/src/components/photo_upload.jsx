'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import ThemeToggle from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { Upload, Camera, Image as ImageIcon, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PhotoUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const { isDarkMode } = useTheme()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files) => {
    setUploading(true)
    // Simulate upload process
    setTimeout(() => {
      const newFiles = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        status: 'completed',
        preview: URL.createObjectURL(file)
      }))
      setUploadedFiles(prev => [...prev, ...newFiles])
      setUploading(false)
    }, 2000)
  }

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className={`min-h-screen p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      {/* Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
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
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
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
          }`}>Upload & Enhance</h1>
          <p className={`text-lg transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Drop your craft photos here for AI enhancement</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`mb-8 shadow-xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-orange-100'
          }`}>
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? isDarkMode
                      ? 'border-orange-400 bg-orange-900/20' 
                      : 'border-orange-500 bg-orange-50'
                    : isDarkMode
                      ? 'border-gray-600 hover:border-gray-500' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Upload className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>
                      Drop your craft photos here
                    </h3>
                    <p className={`mb-4 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Or click to browse your files
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button asChild>
                          <span className="cursor-pointer bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg">
                            <Camera className="mr-2 h-4 w-4" />
                            Choose Photos
                          </span>
                        </Button>
                      </motion.div>
                    </label>
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Supports JPG, PNG, WEBP up to 10MB each
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Progress */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`mb-8 transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border-orange-100'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Processing your images...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className={`shadow-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
                : 'bg-white/80 backdrop-blur-sm border-orange-100'
            }`}>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  <ImageIcon className="h-5 w-5" />
                  <span>Uploaded Photos</span>
                </CardTitle>
                <CardDescription className={`transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {uploadedFiles.length} photo{uploadedFiles.length !== 1 ? 's' : ''} ready for enhancement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((file) => (
                    <motion.div 
                      key={file.id} 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`aspect-square rounded-lg overflow-hidden transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        {file.status === 'completed' ? (
                          <div className="bg-green-500 rounded-full p-1 shadow-lg">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="bg-yellow-500 rounded-full p-1 shadow-lg">
                            <AlertCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className={`text-sm font-medium truncate transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {file.name}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}