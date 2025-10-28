import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000
const DOMAIN = process.env.DOMAIN || 'http://panel-api.strangled.net'
const IS_VERCEL = process.env.VERCEL === '1'

// Middleware
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: IS_VERCEL ? 4 * 1024 * 1024 : 10 * 1024 * 1024, // 4MB for Vercel, 10MB for VPS
    files: 5
  },
  useTempFiles: IS_VERCEL, // Important for Vercel
  abortOnLimit: true
}))

// Static files hanya untuk VPS
if (!IS_VERCEL) {
  app.use('/uploads', express.static(join(__dirname, 'uploads')))
  
  // Buat folder uploads untuk VPS
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads')
  }
}

// ==================== UNIVERSAL HTML DOCUMENTATION ====================
const htmlDocumentation = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Universal Upload API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 50px 0;
            color: white;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .platform-badge {
            background: ${IS_VERCEL ? '#000000' : '#48bb78'};
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 1rem;
            margin: 10px;
            display: inline-block;
        }
        
        .card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
        }
        
        .method {
            background: #667eea;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: bold;
            margin-right: 10px;
            font-size: 0.9rem;
        }
        
        .url {
            font-family: 'Courier New', monospace;
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .feature {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            background: #f1f3f4;
            border-radius: 8px;
        }
        
        .feature-icon {
            font-size: 1.5rem;
            margin-right: 15px;
        }
        
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px 5px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            background: #5a67d8;
            transform: translateY(-2px);
        }
        
        .footer {
            text-align: center;
            padding: 40px 0;
            color: white;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Universal Upload API</h1>
            <div class="platform-badge">
                ${IS_VERCEL ? '▲ VERCEL' : '🖥️ VPS'} PLATFORM
            </div>
            <p style="font-size: 1.2rem; opacity: 0.9;">
                Single Codebase - Dual Platform Support
            </p>
            <p>📍 ${DOMAIN}</p>
        </div>

        <div class="card">
            <h2 style="color: #667eea; margin-bottom: 20px;">📊 System Information</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${IS_VERCEL ? '▲ Vercel' : '🖥️ VPS'}</div>
                    <div>Platform</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${IS_VERCEL ? '4MB' : '10MB'}</div>
                    <div>Max File Size</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${PORT}</div>
                    <div>Port</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">🚀</div>
                    <div>Performance</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 style="color: #667eea; margin-bottom: 20px;">🔧 API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url">/</span>
                <p style="margin-top: 8px;">📖 API Documentation</p>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span>
                <span class="url">/upload</span>
                <p style="margin-top: 8px;">📤 Upload and Process Image</p>
                <p><strong>Body:</strong> form-data with 'image' field</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url">/health</span>
                <p style="margin-top: 8px;">❤️ Health Check</p>
            </div>
        </div>

        <div class="card">
            <h2 style="color: #667eea; margin-bottom: 20px;">💡 Features</h2>
            
            <div class="feature">
                <div class="feature-icon">🔄</div>
                <div>
                    <strong>Auto Platform Detection</strong>
                    <p>Automatically adapts to Vercel or VPS environment</p>
                </div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">🖼️</div>
                <div>
                    <strong>Smart Image Processing</strong>
                    <p>Automatic format conversion and optimization with Sharp</p>
                </div>
            </div>
            
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <div>
                    <strong>High Performance</strong>
                    <p>Optimized for both serverless and traditional hosting</p>
                </div>
            </div>
            
            ${!IS_VERCEL ? `
            <div class="feature">
                <div class="feature-icon">🧹</div>
                <div>
                    <strong>Auto Cleanup</strong>
                    <p>Automatic file cleanup every 10 minutes (VPS only)</p>
                </div>
            </div>
            ` : ''}
        </div>

        <div class="card">
            <h2 style="color: #667eea; margin-bottom: 20px;">🔗 Quick Usage</h2>
            
            <div class="code-block" style="background: #2d3748; color: white; padding: 20px; border-radius: 8px; margin: 15px 0; font-family: monospace;">
// JavaScript Fetch Example<br>
const formData = new FormData();<br>
formData.append('image', file);<br>
<br>
const response = await fetch('${DOMAIN}/upload', {<br>
&nbsp;&nbsp;method: 'POST',<br>
&nbsp;&nbsp;body: formData<br>
});<br>
<br>
const result = await response.json();<br>
// Returns: { success: true, url: '...', message: '...' }
            </div>
            
            <button class="btn" onclick="testAPI()">🧪 Test Upload API</button>
        </div>

        <div class="card" style="text-align: center;">
            <h2 style="color: #667eea; margin-bottom: 15px;">🛠️ Built by Ahmad</h2>
            <p style="margin-bottom: 15px;">Universal Upload API - One Codebase, Multiple Platforms</p>
            <div style="background: #f1f3f4; padding: 15px; border-radius: 10px; display: inline-block;">
                <strong>Supported Platforms:</strong>
                <div style="margin-top: 10px;">
                    <span style="background: #48bb78; color: white; padding: 5px 15px; border-radius: 15px; margin: 3px; display: inline-block;">VPS</span>
                    <span style="background: #000000; color: white; padding: 5px 15px; border-radius: 15px; margin: 3px; display: inline-block;">Vercel</span>
                    <span style="background: #667eea; color: white; padding: 5px 15px; border-radius: 15px; margin: 3px; display: inline-block;">Universal</span>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>© 2024 Universal Upload API - Built with ❤️ by Ahmad</p>
            <p>🚀 Powering applications across multiple platforms</p>
        </div>
    </div>

    <script>
        async function testAPI() {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '🔄 Testing...';
            btn.disabled = true;
            
            try {
                // Create test image
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#667eea';
                ctx.fillRect(0, 0, 100, 100);
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText('TEST', 25, 55);
                
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, 'test.jpg');
                    
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('✅ API Test Successful!\\n' + 
                              (result.url ? 'URL: ' + result.url : 'Data: ' + result.data?.substring(0, 50) + '...'));
                    } else {
                        alert('❌ Test Failed: ' + (result.error || 'Unknown error'));
                    }
                    
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 'image/jpeg', 0.8);
                
            } catch (error) {
                alert('❌ Test Error: ' + error.message);
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>
`

// ==================== UNIVERSAL API ROUTES ====================

// Home - Documentation
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(htmlDocumentation)
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    platform: IS_VERCEL ? 'Vercel' : 'VPS',
    domain: DOMAIN,
    timestamp: new Date().toISOString(),
    features: {
      max_file_size: IS_VERCEL ? '4MB' : '10MB',
      image_processing: true,
      auto_cleanup: !IS_VERCEL
    }
  })
})

// Upload endpoint (Universal)
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      })
    }

    const image = req.files.image
    console.log(`📥 Processing: ${image.name} on ${IS_VERCEL ? 'Vercel' : 'VPS'}`)

    // Process image dengan Sharp
    const processedImage = await sharp(image.data)
      .jpeg({ 
        quality: 85,
        progressive: true
      })
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer()

    let responseData

    if (IS_VERCEL) {
      // Vercel: return base64 data
      const base64Image = processedImage.toString('base64')
      const dataUrl = `data:image/jpeg;base64,${base64Image}`
      
      responseData = {
        success: true,
        data: dataUrl,
        message: '🎉 Image processed on Vercel successfully!',
        platform: 'Vercel',
        size: (processedImage.length / 1024).toFixed(2) + ' KB'
      }
    } else {
      // VPS: save file and return URL
      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
      const filepath = join(__dirname, 'uploads', filename)
      
      await fs.promises.writeFile(filepath, processedImage)
      const imageUrl = `${DOMAIN}/uploads/${filename}`
      
      responseData = {
        success: true,
        url: imageUrl,
        filename: filename,
        message: '🎉 Image processed on VPS successfully!',
        platform: 'VPS',
        size: (processedImage.length / 1024).toFixed(2) + ' KB'
      }
    }

    res.json(responseData)

  } catch (error) {
    console.error('❌ Upload error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed: ' + error.message,
      platform: IS_VERCEL ? 'Vercel' : 'VPS'
    })
  }
})

// ==================== VPS ONLY FEATURES ====================

if (!IS_VERCEL) {
  // File cleanup untuk VPS (setiap 10 menit)
  setInterval(() => {
    const uploadsDir = join(__dirname, 'uploads')
    try {
      const files = fs.readdirSync(uploadsDir)
      const now = Date.now()
      let deletedCount = 0
      
      files.forEach(file => {
        const filepath = join(uploadsDir, file)
        try {
          const stats = fs.statSync(filepath)
          if (now - stats.mtime.getTime() > 10 * 60 * 1000) {
            fs.unlinkSync(filepath)
            deletedCount++
          }
        } catch (e) {}
      })
      
      if (deletedCount > 0) {
        console.log(`🧹 VPS Cleanup: ${deletedCount} files removed`)
      }
    } catch (e) {
      console.log('❌ VPS Cleanup failed:', e.message)
    }
  }, 10 * 60 * 1000)
}

// ==================== SERVER START ====================

if (IS_VERCEL) {
  // Export untuk Vercel
  export default app
} else {
  // Start server untuk VPS
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║            🚀 UNIVERSAL UPLOAD API           ║
║              by Ahmad - v2.0.0               ║
╟───────────────────────────────────────────────╢
║ 📍 Domain: ${DOMAIN} ║
║ 🏃 Port: ${PORT}                                ║
║ ⚡ Platform: VPS                              ║
║ 🛠️  Mode: Production Ready                   ║
╚═══════════════════════════════════════════════╝
    `)
    console.log('📖 Documentation: http://localhost:' + PORT)
    console.log('🔧 Health Check: http://localhost:' + PORT + '/health')
  })
  }
