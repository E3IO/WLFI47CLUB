# 自建IPFS节点完整指南

## 1. 服务器准备
### 推荐配置
- **云服务商**: AWS Lightsail($3.5/月) / DigitalOcean($5/月)
- **系统**: Ubuntu 22.04 LTS
- **配置**: 1CPU / 1GB RAM / 25GB SSD (最低要求)

## 2. 安装IPFS
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装依赖
sudo apt install wget unzip -y

# 下载最新版IPFS
wget https://dist.ipfs.tech/kubo/v0.26.0/kubo_v0.26.0_linux-amd64.tar.gz

# 解压安装
tar -xvzf kubo_*.tar.gz
cd kubo
sudo ./install.sh

# 验证安装
ipfs --version
```

## 3. 初始化节点
```bash
ipfs init --profile server

# 修改配置(关键优化)
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config --json Swarm.ConnMgr.HighWater 200
ipfs config --json Datastore.StorageMax "10GB"
```

## 4. 系统服务设置
创建systemd服务文件：
```bash
sudo tee /etc/systemd/system/ipfs.service <<EOF
[Unit]
Description=IPFS Daemon
After=network.target

[Service]
ExecStart=/usr/local/bin/ipfs daemon --enable-gc=false
User=ubuntu
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 启动服务
sudo systemctl enable ipfs
sudo systemctl start ipfs
```

## 5. 防火墙配置
```bash
sudo ufw allow 4001/tcp  # Swarm端口
sudo ufw allow 8080/tcp  # 网关端口
sudo ufw allow 5001/tcp  # API端口
sudo ufw enable
```

## 6. 内容固定与维护
### 手动固定内容
```bash
ipfs pin add <CID>
```

### 自动同步脚本(每日)
```bash
#!/bin/bash
LOG_FILE="/var/log/ipfs_maintenance.log"
CID_LIST=("QmXx..." "QmYy...")

for cid in "${CID_LIST[@]}"; do
  ipfs pin add "$cid" >> "$LOG_FILE" 2>&1
  ipfs refs -r "$cid" >> "$LOG_FILE" 2>&1
done
```

## 7. 监控与维护
```bash
# 查看节点状态
ipfs stats bw

# 查看连接节点
ipfs swarm peers
```

## 8. 备份配置
```bash
# 备份关键数据
cp ~/.ipfs/config ~/ipfs_config_backup
```

## 9. 绑定ENS域名 (wlfi-47.eth)

### 方法1：通过ENS管理器
1. 访问[ENS官方应用](https://app.ens.domains/)
2. 连接你的钱包(需持有wlfi-47.eth的管理权限)
3. 找到你的域名 → 点击"管理"
4. 在"内容哈希"字段输入：`ipfs://<你的CID>`
5. 确认交易(需支付Gas费)

### 方法2：通过DNS TXT记录(更稳定)
```bash
# 在域名DNS管理面板添加TXT记录
_dnslink.wlfi-47.eth.  IN  TXT  "dnslink=/ipfs/<你的CID>"
```

### 验证配置
```bash
# 使用dig命令验证
dig +short TXT _dnslink.wlfi-47.eth

# 或通过IPFS网关访问
curl https://gateway.ipfs.io/ipns/wlfi-47.eth
```

### 高级技巧
1. **多版本回退**：
   ```
   dnslink=/ipfs/<旧CID>/backup
   ```
2. **子域名分配**：
   ```
   _dnslink.blog.wlfi-47.eth. IN TXT "dnslink=/ipfs/<博客CID>"
   ```
3. **自动化更新**：
   使用[IPFS DNSLink Updater](https://github.com/ipfs-shipyard/dnslink-deploy)工具

## 高级选项
- **集群模式**: 使用ipfs-cluster实现多节点冗余
- **网关加速**: 配置Nginx反向代理
- **DNSLink**: 绑定自定义域名
