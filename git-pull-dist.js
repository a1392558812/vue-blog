import { execSync } from 'child_process'

const executeCommand = (command, description) => {
  try {
    console.log(`执行: ${description}`)
    execSync(command, { stdio: 'inherit' })
    console.log(`✓ ${description} 成功\n`)
    return true
  } catch (error) {
    console.error(`✗ ${description} 失败`)
    return false
  }
}

const executeWithRetry = (command, description) => {
  let attempt = 0

  while (true) {
    attempt++
    console.log(`\n${description} - 第 ${attempt} 次尝试`)

    if (executeCommand(command, description)) {
      return true
    }

    console.log(`5 秒后重试...`)
    const startTime = Date.now()
    while (Date.now() - startTime < 5000) {
      // 阻塞等待
    }
  }
}

const main = () => {
  if (!executeCommand('git checkout build-dist', '切换到 build-dist 分支')) {
    console.error('切换分支失败，脚本终止')
    process.exit(1)
  }

  if (!executeWithRetry('git pull origin build-dist', '从 origin 拉取 build-dist 分支')) {
    console.error('拉取 build-dist 分支失败，脚本终止')
    process.exit(1)
  }

  console.log('\n=== 拉取完成 ===')

  // 桌面弹窗通知
  try {
    console.log('发送桌面通知...')
    // 跨平台通知实现
    if (process.platform === 'win32') {
      // Windows 系统
      execSync(
        'powershell -Command "[System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms"); [System.Windows.Forms.MessageBox]::Show("Git 拉取 build-dist 分支完成！", "操作完成", 0)"',
        { stdio: 'ignore' }
      )
    } else if (process.platform === 'darwin') {
      // macOS 系统
      execSync(
        'osascript -e "display notification "Git 拉取 build-dist 分支完成！" with title "操作完成""',
        { stdio: 'ignore' }
      )
    } else {
      // Linux 系统
      execSync('notify-send "操作完成" "Git 拉取 build-dist 分支完成！"', { stdio: 'ignore' })
    }
    console.log('通知发送成功')
  } catch (error) {
    console.log('通知发送失败，可能是系统不支持或未安装相关依赖')
  }
}

main()
