const express = require('express');
const path = require('path'); // 新增：引入 path 模块
const { Checkout } = require('checkout-sdk-node');
const app = express();

// 新增：托管前端目录为静态资源
app.use(express.static(path.join(__dirname, '../frontend')));

const cko = new Checkout('sk_sbox_xxx', { 
  environment: 'sandbox' // 测试环境
});

// 生成Hosted Payment Page链接
app.get('/create-payment-link', async (req, res) => {
  try {
    const paymentLink = await cko.paymentLinks.create({
      amount: 2999, // 金额以最小单位表示（EUR对应分）
      currency: 'EUR', // 根据用户地理位置动态切换（示例为荷兰）
      description: 'iPhone 15 Case',
      reference: 'ORDER_123',
      customer: {
        email: 'customer@example.com' // 可从实际请求中获取
      },
      billing: {
        address: {
          country: 'NL' // 动态设置（NL/HK）
        }
      },
      payment_methods: ['card', 'applepay', 'ideal'], // 根据地区动态选择
      return_url: 'http://localhost:3000/result?success={success}&message={message}'
    });
    res.json({ url: paymentLink._links.redirect.href });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 启动服务
app.listen(3000, () => console.log('Server running on port 3000'));
