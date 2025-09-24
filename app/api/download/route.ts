import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('file')

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 })
  }

  // 模拟文件下载 - 在实际应用中，这里会从真实的存储系统获取文件
  const fileContent = generateMockFileContent(fileName)
  
  // 设置适当的Content-Type
  let contentType = 'application/octet-stream'
  if (fileName.endsWith('.pdf')) {
    contentType = 'application/pdf'
  } else if (fileName.endsWith('.docx')) {
    contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  } else if (fileName.endsWith('.doc')) {
    contentType = 'application/msword'
  }

  return new NextResponse(fileContent.toString(), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      'Content-Length': fileContent.length.toString(),
    },
  })
}

function generateMockFileContent(fileName: string): Buffer {
  // 生成模拟文件内容
  const content = `
北京理工大学学位论文管理系统
文件名: ${fileName}
生成时间: ${new Date().toLocaleString('zh-CN')}

这是一个模拟下载文件，用于功能测试。

文件说明：
- 内部论文说明单.pdf: 用于内部论文管理的说明文档
- 电子论文数据申请表.pdf: 申请电子论文数据的表格
- 博士学位论文模板.docx: 博士学位论文的标准模板
- 硕士学位论文模板.docx: 硕士学位论文的标准模板

请联系系统管理员获取真实文件。

北京理工大学
学位论文管理系统
`

  return Buffer.from(content, 'utf-8')
}