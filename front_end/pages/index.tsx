'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Announcement {
  band_code: string
  bond_abbreviation: string
  announcement_title: string
  classification_announcements: string
  announcements_datetime: string
}

export default function BondAnnouncementQuery() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [count, setCount] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 15)
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      fetchData()
    }
  }, [startDate, endDate])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/commonSoaQuery?startDate=${startDate} 00:00:00&endDate=${endDate} 23:59:59`)
      const data = await response.json()
      setAnnouncements(data.data.results)
      setCount(data.data.results.length)
      setTotalPages(Math.max(1, Math.ceil(data.data.results.length / 25)))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPageNo(newPage)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-11"
    >
      <div className="p-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-gray-800"
        >
          公司债券公告查询
        </motion.h2>
        <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} className="space-y-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            查询
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 text-lg font-semibold text-gray-700"
        >
          公告数: {count}条
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-40"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 overflow-x-auto"
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">债券代码</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">债券简称</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公告标题</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公告分类</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公告时间</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {announcements.map((announcement, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.band_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.bond_abbreviation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.announcement_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.classification_announcements}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{announcement.announcements_datetime}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex justify-between items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pageNo - 1)}
            disabled={pageNo === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
          >
            上一页
          </motion.button>
          <span className="text-gray-600">第 {pageNo} 页，共 {totalPages} 页</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(pageNo + 1)}
            disabled={pageNo === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
          >
            下一页
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}