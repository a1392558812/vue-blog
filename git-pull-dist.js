import { execSync } from 'child_process'

// 执行命令并返回是否成功
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

// 重试执行函数 (无限重试)
const executeWithRetry = (command, description) => {
  let attempt = 0

  while (true) {
    attempt++
    console.log(`\n${description} - 第 ${attempt} 次尝试`)

    if (executeCommand(command, description)) {
      return true
    }

    console.log(`等待 2 秒后重试...`)
    // 等待2秒
    const startTime = Date.now()
    while (Date.now() - startTime < 2000) {
      // 阻塞等待
    }
  }
}

const main = () => {
  // 步骤1: 切换到 build-dist 分支（如果不存在则创建）
  if (!executeCommand('git checkout build-dist', '切换到 build-dist 分支')) {
    console.error('切换分支失败，脚本终止')
    process.exit(1)
  }

  // 步骤2: 从远程 origin 拉取 build-dist 分支 (带重试)
  if (!executeWithRetry('git pull origin build-dist', '从 origin 拉取 build-dist 分支')) {
    console.error('拉取 build-dist 分支失败，脚本终止')
    process.exit(1)
  }

  console.log('\n=== 拉取完成 ===')
}

main()
