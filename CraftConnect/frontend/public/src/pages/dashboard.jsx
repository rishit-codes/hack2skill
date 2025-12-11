'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Camera,
  FileText,
  Globe,
  DollarSign,
  Sparkles,
  Menu,
  X,
  Upload,
  BarChart3,
  Users,
  Star,
  TrendingUp,
  User
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
    }
  }

  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, active: true },
    { name: 'Upload Co-Pilot', href: '/upload', icon: Upload },
    { name: 'Storyteller', href: '/story', icon: FileText },
    { name: 'Price Helper', href: '/price', icon: DollarSign },
    { name: 'Recommendations', href: '/recommend', icon: Star },
    { name: 'My Profile', href: '/profile', icon: User },
  ]

  const stats = [
    { label: 'Photos Enhanced', value: '12', change: '+3 this week', icon: Camera },
    { label: 'Stories Created', value: '8', change: '+2 this week', icon: FileText },
    { label: 'Products Listed', value: '6', change: '+1 this week', icon: Upload },
    { label: 'Fair Price Score', value: '94%', change: '+5% improvement', icon: TrendingUp },
  ]

  const tools = [
    {
      title: 'Upload & Enhance',
      description: 'Drop your craft photos here for AI enhancement',
      icon: Upload,
      color: 'bg-blue-500'
    },
    {
      title: 'Tell Your Story',
      description: 'Generate compelling narratives for your creations',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      title: 'Price with Confidence',
      description: 'AI-powered fair pricing for your artwork',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
    {
      title: 'Get Recommendations',
      description: 'Personalized insights for your business',
      icon: Star,
      color: 'bg-pink-500'
    }
  ]

  const recentActivity = [
    { name: "Priya's Pottery", action: "Enhanced 25 ceramic pieces", avatar: "P" },
    { name: "Ravi's Woodwork", action: "Created multilingual stories", avatar: "R" },
    { name: "Meera's Textiles", action: "Optimized pricing strategy", avatar: "M" },
  ]

  return (
    <div className={`min-h-screen transition-all duration-300 ${isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
      }`}>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -280 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed inset-y-0 left-0 z-50 w-64 shadow-xl border-r transition-all duration-300 ${isDarkMode
            ? 'bg-gray-800/95 backdrop-blur-sm border-gray-700'
            : 'bg-white/95 backdrop-blur-sm border-orange-100'
          }`}
      >
        <div className={`flex items-center justify-between h-16 px-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-orange-100'
          }`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              CraftConnect
            </span>
          </motion.div>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1 rounded-md transition-colors duration-300 ${isDarkMode
                ? 'hover:bg-gray-700 text-orange-400'
                : 'hover:bg-orange-100 text-orange-600'
              }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-sm italic mb-6 font-medium transition-colors duration-300 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'
              }`}
          >
            "Where Tradition Meets Tomorrow"
          </motion.p>
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${item.active
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-orange-300'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                >
                  <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${item.active ? 'text-white' : 'text-orange-500'
                    }`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`shadow-sm border-b sticky top-0 z-30 transition-all duration-300 ${isDarkMode
              ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
              : 'bg-white/80 backdrop-blur-sm border-orange-100'
            }`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${isDarkMode
                    ? 'hover:bg-gray-700 text-orange-400'
                    : 'hover:bg-orange-100 text-orange-600'
                  }`}
              >
                <Menu className="h-5 w-5" />
              </motion.button>
              <motion.h1
                variants={slideInLeft}
                className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
              >
                Your Craft Studio
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`transition-colors duration-300 ${isDarkMode
                      ? 'border-gray-600 text-orange-400 hover:bg-gray-700'
                      : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    }`}
                >
                  Menu
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Dashboard Content */}
        <main className="p-6 lg:p-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-10"
          >
            {/* Welcome Section */}
            <motion.div variants={fadeInUp} className="text-center lg:text-left">
              <motion.h2
                className={`text-4xl lg:text-5xl font-bold mb-4 transition-all duration-300 ${isDarkMode
                    ? 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'
                  }`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Hello Maya, ready to share your craft today?
              </motion.h2>
              <motion.p
                className={`text-lg max-w-2xl transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your AI companion is here to help bring your beautiful work to life
              </motion.p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="group"
                >
                  <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${isDarkMode
                      ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700'
                      : 'bg-white/80 backdrop-blur-sm border-orange-100'
                    }`}>
                    <CardContent className="p-6">
                      <motion.div
                        className="flex items-center justify-between"
                        variants={cardHover}
                      >
                        <div>
                          <motion.p
                            className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {stat.value}
                          </motion.p>
                          <p className={`text-sm font-medium mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>{stat.label}</p>
                          <p className="text-xs text-green-400 mt-2 font-medium">{stat.change}</p>
                        </div>
                        <motion.div
                          className="h-14 w-14 bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <stat.icon className="h-7 w-7 text-white" />
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Your Craft Studio Section */}
            <motion.div variants={fadeInUp}>
              <motion.div
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                  <h3 className={`text-3xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>Your Craft Studio</h3>
                  <motion.div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm transition-all duration-300 ${isDarkMode
                        ? 'bg-gradient-to-r from-gray-700 to-gray-600'
                        : 'bg-gradient-to-r from-orange-100 to-amber-100'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className={`h-5 w-5 transition-colors duration-300 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'
                        }`} />
                    </motion.div>
                    <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-orange-300' : 'text-orange-700'
                      }`}>AI-Powered Tools</span>
                  </motion.div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map((tool, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    className="group cursor-pointer"
                  >
                    <Card className={`hover:shadow-2xl transition-all duration-500 overflow-hidden ${isDarkMode
                        ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                        : 'bg-white/90 backdrop-blur-sm border-orange-100'
                      }`}>
                      <CardHeader className="pb-4 relative">
                        <motion.div
                          className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <tool.icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <CardTitle className={`text-xl font-bold transition-colors duration-300 group-hover:text-orange-500 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                          }`}>
                          {tool.title}
                        </CardTitle>
                        <CardDescription className={`text-sm leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {tool.description}
                        </CardDescription>
                        <motion.div
                          className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </CardHeader>
                      <CardContent className="pt-0">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className={`w-full transition-all duration-300 ${isDarkMode
                                ? 'border-gray-600 text-orange-400 hover:bg-gray-700 hover:border-orange-400'
                                : 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300'
                              }`}
                          >
                            Get Started
                            <motion.div
                              className="ml-2"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.div>
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity Section */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weekly Progress */}
              <motion.div
                variants={scaleIn}
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <Card className={`shadow-lg hover:shadow-xl transition-all duration-500 ${isDarkMode
                    ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                    : 'bg-white/90 backdrop-blur-sm border-orange-100'
                  }`}>
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BarChart3 className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                          }`}>Weekly Progress</CardTitle>
                        <CardDescription className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'
                          }`}>Your craft journey this week</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Photos Enhanced", progress: 60, current: 3, goal: 5, color: "orange" },
                      { label: "Stories Created", progress: 67, current: 2, goal: 3, color: "green" },
                      { label: "Products Listed", progress: 50, current: 1, goal: 2, color: "blue" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>{item.label}</span>
                          <span className={`text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>{item.current}/{item.goal} goal</span>
                        </div>
                        <div className={`w-full rounded-full h-3 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                          <motion.div
                            className={`h-3 rounded-full bg-gradient-to-r ${item.color === 'orange' ? 'from-orange-400 to-orange-600' :
                                item.color === 'green' ? 'from-green-400 to-green-600' :
                                  'from-blue-400 to-blue-600'
                              }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Community Highlights */}
              <motion.div
                variants={scaleIn}
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <Card className={`shadow-lg hover:shadow-xl transition-all duration-500 ${isDarkMode
                    ? 'bg-gray-800/90 backdrop-blur-sm border-gray-700'
                    : 'bg-white/90 backdrop-blur-sm border-orange-100'
                  }`}>
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Users className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <CardTitle className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                          }`}>Community Highlights</CardTitle>
                        <CardDescription className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'
                          }`}>See what fellow artisans are creating</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 cursor-pointer ${isDarkMode
                            ? 'hover:bg-gray-700/50'
                            : 'hover:bg-orange-50'
                          }`}
                      >
                        <motion.div
                          className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {activity.avatar}
                        </motion.div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'
                            }`}>{activity.name}</p>
                          <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{activity.action}</p>
                        </div>
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: sidebarOpen ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 bg-black z-40 lg:hidden ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Floating Action Button for Mobile */}
      <motion.button
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSidebarOpen(true)}
        animate={{
          boxShadow: ["0 10px 20px rgba(251, 146, 60, 0.3)", "0 15px 30px rgba(251, 146, 60, 0.4)", "0 10px 20px rgba(251, 146, 60, 0.3)"]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Menu className="h-6 w-6" />
      </motion.button>
    </div>
  )
}