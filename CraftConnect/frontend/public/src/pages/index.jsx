'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import { Camera, FileText, Globe, DollarSign, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const { isDarkMode } = useTheme()

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-10">
        <motion.div
          variants={slideInLeft}
          initial="initial"
          animate="animate"
          className="flex items-center space-x-2"
        >
          <motion.div 
            className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            CraftConnect
          </span>
        </motion.div>
        
        <motion.div
          variants={slideInRight}
          initial="initial"
          animate="animate"
          className="flex items-center space-x-4"
        >
          <ThemeToggle />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setShowLogin(!showLogin)}
              variant="outline"
              className={`transition-all duration-300 ${
                isDarkMode 
                  ? 'border-gray-600 text-orange-400 hover:bg-gray-700 hover:border-orange-400' 
                  : 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
              }`}
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h1 className={`text-5xl font-bold leading-tight transition-all duration-300 ${
                isDarkMode 
                  ? 'text-gray-100' 
                  : 'text-gray-900'
              }`}>
                Welcome to <span className="text-orange-600">CraftConnect</span>
              </h1>
              <p className={`text-xl mt-4 font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-orange-300' : 'text-orange-700'
              }`}>
                Where Tradition Meets Tomorrow
              </p>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className={`text-lg leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Your AI-powered companion for bringing beautiful handcrafted work to the digital
              world. Enhance photos, craft stories, translate descriptions, and price your
              art with confidence.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Camera, text: "Photo Enhancement" },
                { icon: FileText, text: "Story Generation" },
                { icon: Globe, text: "Multi-language Support" },
                { icon: DollarSign, text: "Fair Pricing" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-full shadow-sm border transition-all duration-300 hover:shadow-md ${
                    isDarkMode 
                      ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-orange-400' 
                      : 'bg-white/80 backdrop-blur-sm border-orange-100 hover:border-orange-300'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="h-5 w-5 text-orange-600" />
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className={`text-sm italic font-medium transition-colors duration-300 ${
                isDarkMode ? 'text-orange-300' : 'text-orange-700'
              }`}
            >
              Made for artisans, by artisans
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
          >
            <Card className={`shadow-2xl hover:shadow-3xl transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
                : 'bg-white/90 backdrop-blur-sm border-orange-200'
            }`}>
              <CardHeader className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className={`text-2xl font-bold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>Welcome back</CardTitle>
                  <CardDescription className={`mt-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Enter your details to access your craft studio
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-orange-400' 
                        : 'border-orange-200 bg-white text-gray-900 placeholder-gray-500 focus:border-orange-500'
                    }`}
                  />
                </motion.div>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className={`text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-orange-400' 
                        : 'border-orange-200 bg-white text-gray-900 placeholder-gray-500 focus:border-orange-500'
                    }`}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href="/dashboard">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        Enter Your Studio
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p className={`text-sm mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>OR CONTINUE WITH</p>
                  <div className="flex gap-2">
                    <motion.div 
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className={`w-full transition-colors duration-300 ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-orange-200 text-gray-700 hover:bg-orange-50'
                      }`}>
                        Google
                      </Button>
                    </motion.div>
                    <motion.div 
                      className="flex-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className={`w-full transition-colors duration-300 ${
                        isDarkMode 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-orange-200 text-gray-700 hover:bg-orange-50'
                      }`}>
                        Facebook
                      </Button>
                    </motion.div>
                  </div>
                  <p className={`text-sm mt-4 transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    New to CraftConnect?{' '}
                    <motion.span 
                      className="text-orange-500 font-medium cursor-pointer hover:underline"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      Create your studio
                    </motion.span>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Decorative Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <motion.div 
            className={`inline-block rounded-3xl p-10 shadow-2xl border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700' 
                : 'bg-white/90 backdrop-blur-sm border-orange-100'
            }`}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-40 h-40 bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 rounded-2xl flex items-center justify-center shadow-inner"
              animate={{ 
                boxShadow: [
                  "inset 0 0 20px rgba(251, 146, 60, 0.3)",
                  "inset 0 0 30px rgba(251, 146, 60, 0.5)",
                  "inset 0 0 20px rgba(251, 146, 60, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-20 w-20 text-orange-600" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}