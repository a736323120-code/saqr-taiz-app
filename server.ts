import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily/safely
  const getGenAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Shared in-memory data store for live demo interaction
  const inMemoryOrders: any[] = [
    {
      id: 'ord-1001',
      orderNumber: 'SQR-8890',
      customerId: 'usr-guest-1',
      customerName: 'أحمد التعيزي',
      customerPhone: '771234567',
      district: 'شارع جمال',
      addressDetails: 'شارع جمال - بجانب صيدلية العالمية',
      items: [
        {
          product: {
            id: 'p-1',
            storeId: 'store-1',
            storeName: 'مطعم الشيباني للوجبات الشعبية',
            name: 'وجبة سلته تعزية باللحم المفروم',
            category: 'وجبات شعبية',
            price: 3500,
            image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=500&q=80',
            description: 'سلته تعزية حارة تقدم في المدرة الفخار',
            available: true,
          },
          quantity: 2,
        },
      ],
      subtotal: 7000,
      deliveryFee: 1000,
      discount: 700,
      total: 7300,
      status: 'on_the_way',
      paymentMethod: 'kuraimi_bank',
      paymentReceiptRef: 'KR-9988221',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      captainId: 'cap-1',
      captainName: 'الكابتن صادق اليعبري',
      captainPhone: '778990011',
      captainCoords: { lat: 13.5790, lng: 44.0170 },
    },
  ];

  const inMemoryListings: any[] = [];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'منصة صقر تعز' });
  });

  // AI Assistant Endpoint (صقر AI)
  app.post('/api/ai-assistant', async (req, res) => {
    try {
      const { prompt, userDistrict } = req.body;
      const ai = getGenAIClient();

      if (!ai) {
        return res.json({
          reply: 'أهلاً بك في منصة صقر تعز! يسعدني إجابة استفساراتك حول المطاعم، الصيدليات، والمشاوير والتوصيل بمدينة تعز. (ملاحظة: يمكنك ضبط مفتاح Gemini API في إعدادات التطبيق للتواصل الذكي المتقدم).',
        });
      }

      const systemInstruction = `أنت "صقر AI"، المساعد الذكي التفاعلي والودود لمنصة "صقر" في مدينة تعز باليمن.
تتحدث باللغة العربية بأسلوب يمني تعزي ودود، محترم وواضح.
مهامك:
1. إرشاد المستخدمين حول الخدمات المتوفرة بمدينة تعز (مطاعم، صيدليات، بقالات، أسواق الخضار، دليل المهندسين والعقارات).
2. الإجابة عن كيفية الطلب، التوصيل عبر الكباتن، والمشاوير الخاصة ("طلب مشوار" لنقل غرض من مكان لآخر).
3. توضيح طرق الدفع: إما الدفع عند الاستلام (COD) أو التحويل عبر شبكة الكريمي للصرافة (حساب رقم 2180919 باسم منصة صقر).
4. تزويد المستخدم برقم دعم واتساب المباشر: +967780947342 أو الإيميل hawkfordelivery@gmail.com عند الحاجة للمساعدة المباشرة.
المنطقة الحالية للمستخدم إن وجدت: ${userDistrict || 'مدينة تعز'}.
إجاباتك مختصرة، عملية، ومفيدة جداً.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt || 'ما هي الخدمات المتاحة في منصة صقر تعز؟',
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        reply: 'مرحباً بك! أنا صقر AI. يبدو أن هناك ضغطاً مؤقتاً في الاتصال، لكن يمكنك تصفح دليل تعز وإجراء طلبياتك أو مراسلتنا فوراً عبر الواتساب: +967780947342.',
      });
    }
  });

  // Orders API
  app.get('/api/orders', (req, res) => {
    res.json({ orders: inMemoryOrders });
  });

  app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    const orderId = 'ord-' + Date.now().toString().slice(-6);
    const orderNumber = 'SQR-' + Math.floor(1000 + Math.random() * 9000);
    
    const formattedOrder = {
      ...newOrder,
      id: orderId,
      orderNumber,
      status: 'received',
      createdAt: new Date().toISOString(),
      captainId: 'cap-1',
      captainName: 'الكابتن صادق اليعبري',
      captainPhone: '778990011',
      captainCoords: { lat: 13.5780, lng: 44.0150 },
    };

    inMemoryOrders.unshift(formattedOrder);
    res.json({ success: true, order: formattedOrder });
  });

  app.patch('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status, captainCoords } = req.body;

    const orderIndex = inMemoryOrders.findIndex((o) => o.id === id);
    if (orderIndex !== -1) {
      if (status) inMemoryOrders[orderIndex].status = status;
      if (captainCoords) inMemoryOrders[orderIndex].captainCoords = captainCoords;
      res.json({ success: true, order: inMemoryOrders[orderIndex] });
    } else {
      res.status(404).json({ error: 'الطلب غير موجود' });
    }
  });

  // Service Provider Subscriptions API
  app.get('/api/listings', (req, res) => {
    res.json({ listings: inMemoryListings });
  });

  app.post('/api/listings', (req, res) => {
    const newListing = {
      ...req.body,
      id: 'sub-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'approved',
    };
    inMemoryListings.unshift(newListing);
    res.json({ success: true, listing: newListing });
  });

  // Coupons verification API
  app.post('/api/coupons/verify', (req, res) => {
    const { code, subtotal } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();

    if (cleanCode === 'SQR10') {
      res.json({ valid: true, discountPercent: 10, description: 'خصم 10% على إجمالي المنتجات' });
    } else if (cleanCode === 'TAIZ20') {
      if (subtotal >= 3000) {
        res.json({ valid: true, discountPercent: 20, description: 'خصم 20% للطلبات فوق 3000 ريال يمني' });
      } else {
        res.json({ valid: false, message: 'كود TAIZ20 يتطلب إجمالي طلب لا يقل عن 3000 ريال يمني' });
      }
    } else if (cleanCode === 'FREEDEL') {
      res.json({ valid: true, discountAmount: 1000, description: 'خصم 1000 ريال يمني على التوصيل' });
    } else {
      res.json({ valid: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية' });
    }
  });

  // Vite Development / Static Production Handler
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`منصة صقر تعز تعمل بنجاح على المنفذ ${PORT}`);
  });
}

startServer();
