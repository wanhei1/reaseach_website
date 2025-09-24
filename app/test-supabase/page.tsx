'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState('测试中...')
  const [errorDetails, setErrorDetails] = useState('')
  const [config, setConfig] = useState({
    url: '',
    hasAnonKey: false
  })

  useEffect(() => {
    // 检查配置
    setConfig({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '未配置',
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })

    async function testConnection() {
      try {
        console.log('🔍 开始测试Supabase连接...')
        
        // 测试简单的查询
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
        
        if (error) {
          console.error('❌ 查询错误:', error)
          setConnectionStatus('连接失败')
          setErrorDetails(`错误: ${error.message}`)
          
          // 如果表不存在，尝试其他测试
          if (error.message.includes('relation "profiles" does not exist')) {
            console.log('💡 profiles表不存在，尝试测试认证...')
            testAuth()
          }
        } else {
          console.log('✅ 数据库查询成功!', data)
          setConnectionStatus('连接成功！')
          setErrorDetails(`成功获取数据: ${JSON.stringify(data, null, 2)}`)
        }
      } catch (err) {
        console.error('❌ 连接异常:', err)
        setConnectionStatus('连接异常')
        setErrorDetails(`异常: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    async function testAuth() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          setErrorDetails(prev => prev + `\n认证错误: ${error.message}`)
        } else {
          setConnectionStatus('基本连接正常（但profiles表不存在）')
          setErrorDetails(prev => prev + '\n认证系统正常工作')
        }
      } catch (err) {
        setErrorDetails(prev => prev + `\n认证异常: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Supabase 连接测试
        </h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">配置信息</h2>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Supabase URL:</strong> {config.url}</p>
              <p><strong>匿名密钥:</strong> {config.hasAnonKey ? '✅ 已配置' : '❌ 未配置'}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-800">连接状态</h2>
            <div className={`mt-2 p-3 rounded-md ${
              connectionStatus.includes('成功') 
                ? 'bg-green-100 text-green-800' 
                : connectionStatus.includes('失败') || connectionStatus.includes('异常')
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {connectionStatus}
            </div>
          </div>
          
          {errorDetails && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">详细信息</h2>
              <pre className="mt-2 p-3 bg-gray-100 rounded-md text-xs overflow-auto">
                {errorDetails}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            重新测试
          </button>
        </div>
      </div>
    </div>
  )
}