import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('file')

  if (!fileName) {
    return NextResponse.json({ error: 'File name is required' }, { status: 400 })
  }

  // 生成PDF预览页面的HTML
  const previewHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>论文预览 - ${fileName}</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #e1e5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            color: #1a365d;
            margin-bottom: 10px;
        }
        .meta {
            color: #666;
            font-size: 14px;
        }
        .content {
            line-height: 1.8;
            color: #333;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 15px;
            border-left: 4px solid #3182ce;
            padding-left: 10px;
        }
        .keywords {
            background: #edf2f7;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .abstract {
            text-align: justify;
            text-indent: 2em;
        }
        .note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 4px;
            margin-top: 30px;
            text-align: center;
            color: #856404;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #3182ce;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 10px 5px;
        }
        .btn:hover {
            background: #2c5aa0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">${fileName.replace('.pdf', '')}</div>
            <div class="meta">北京理工大学学位论文管理系统 - 在线预览</div>
        </div>
        
        <div class="content">
            <div class="section">
                <div class="section-title">论文信息</div>
                <p><strong>文件名：</strong>${fileName}</p>
                <p><strong>预览时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
                <p><strong>文件类型：</strong>PDF文档</p>
            </div>

            <div class="section">
                <div class="section-title">关键词</div>
                <div class="keywords">
                    深度学习, 图像识别, 卷积神经网络, 计算机视觉, 机器学习
                </div>
            </div>

            <div class="section">
                <div class="section-title">摘要</div>
                <div class="abstract">
                    本文研究了基于深度学习的图像识别算法，提出了一种新的卷积神经网络结构。该结构通过引入注意力机制和残差连接，有效提升了图像识别的准确率和效率。
                </div>
                <div class="abstract">
                    实验部分采用了多个公开数据集进行验证，包括CIFAR-10、ImageNet等经典数据集。结果表明，所提出的算法在准确率、召回率和F1分数等指标上均超越了传统的图像识别方法。
                </div>
                <div class="abstract">
                    本研究的主要贡献包括：(1) 提出了一种新颖的注意力机制融合方法；(2) 设计了高效的残差连接结构；(3) 在多个基准数据集上验证了算法的有效性。该研究为深度学习在图像识别领域的应用提供了新的思路和方法。
                </div>
            </div>

            <div class="section">
                <div class="section-title">目录预览</div>
                <ul>
                    <li>第1章 绪论</li>
                    <li>第2章 相关工作</li>
                    <li>第3章 方法设计</li>
                    <li>第4章 实验与分析</li>
                    <li>第5章 总结与展望</li>
                    <li>参考文献</li>
                    <li>致谢</li>
                </ul>
            </div>
        </div>

        <div class="note">
            <p><strong>注意：</strong>这是模拟的论文预览页面，仅用于功能演示。</p>
            <p>在实际应用中，这里会显示真实的PDF文档内容。</p>
            <a href="/api/download?file=${encodeURIComponent(fileName)}" class="btn">下载完整文档</a>
            <a href="javascript:window.close()" class="btn">关闭预览</a>
        </div>
    </div>
</body>
</html>
`

  return new NextResponse(previewHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}