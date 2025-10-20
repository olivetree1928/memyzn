import { useState, useEffect } from 'react';
import { Globe, Moon, Sun, Flame, Flower } from 'lucide-react';
import { supabase } from './supabase';

type Language = 'zh' | 'en';
type Theme = 'light' | 'dark';

interface Content {
  title: string;
  subtitle: string;
  dates: string;
  quote: string;
  biography: {
    title: string;
    content: string[];
  };
  achievements: {
    title: string;
    items: string[];
  };
  legacy: {
    title: string;
    content: string;
  };
  tribute: {
    title: string;
    candle: string;
    flower: string;
    sent: string;
  };
}

const content: Record<Language, Content> = {
  zh: {
    title: '杨振宁先生',
    subtitle: '纪念页',
    dates: '1922年10月1日 - 2025年',
    quote: '我希望年轻人不要把科学看得太神秘，科学就是追求真理的道路。',
    biography: {
      title: '生平简介',
      content: [
        '杨振宁（Chen-Ning Franklin Yang），1922年生于安徽合肥，理论物理学家，诺贝尔物理学奖获得者。',
        '1942年毕业于西南联合大学物理系，1944年获清华大学硕士学位。1948年获芝加哥大学博士学位，师从恩里科·费米。',
        '1957年，杨振宁与李政道因"弱相互作用中宇称不守恒"理论获得诺贝尔物理学奖，成为首位获得诺贝尔奖的华人。',
        '杨振宁的研究涵盖粒子物理、统计力学和凝聚态物理等多个领域，对20世纪理论物理学的发展做出了重大贡献。',
      ],
    },
    achievements: {
      title: '主要成就',
      items: [
        '1956年：与李政道提出弱相互作用中宇称不守恒定律',
        '1957年：获诺贝尔物理学奖（年仅35岁）',
        '杨-米尔斯规范场论（Yang-Mills Theory）- 现代物理学的基石',
        '杨-巴克斯特方程（Yang-Baxter Equation）',
        '在统计力学、凝聚态物理等领域的开创性工作',
        '培养和影响了多代物理学家',
      ],
    },
    legacy: {
      title: '永恒的贡献',
      content: '杨振宁先生不仅是杰出的理论物理学家，更是连接中西方科学界的桥梁。他对祖国的深厚感情和对科学教育的无私奉献，激励着无数后辈学者。他的学术成就和人格魅力将永远铭记在科学史册上。',
    },
    tribute: {
      title: '寄托哀思',
      candle: '送上蜡烛',
      flower: '送上鲜花',
      sent: '已送出',
    },
  },
  en: {
    title: 'Professor Chen-Ning Yang',
    subtitle: 'In Memoriam',
    dates: 'October 1, 1922 - 2025',
    quote: 'I hope young people do not see science as too mysterious. Science is simply the path to pursue truth.',
    biography: {
      title: 'Biography',
      content: [
        'Chen-Ning Franklin Yang, born in 1922 in Hefei, Anhui, was a renowned theoretical physicist and Nobel Prize laureate.',
        'He graduated from National Southwest Associated University in 1942 and received his Master\'s degree from Tsinghua University in 1944. In 1948, he earned his Ph.D. from the University of Chicago under Enrico Fermi.',
        'In 1957, Yang and Tsung-Dao Lee were awarded the Nobel Prize in Physics for their work on parity non-conservation in weak interactions, making Yang the first Chinese Nobel laureate.',
        'Yang\'s research spanned particle physics, statistical mechanics, and condensed matter physics, making profound contributions to 20th-century theoretical physics.',
      ],
    },
    achievements: {
      title: 'Major Achievements',
      items: [
        '1956: Proposed parity non-conservation in weak interactions with T.D. Lee',
        '1957: Nobel Prize in Physics (at age 35)',
        'Yang-Mills Gauge Theory - Foundation of modern physics',
        'Yang-Baxter Equation',
        'Pioneering work in statistical mechanics and condensed matter physics',
        'Mentored and influenced generations of physicists',
      ],
    },
    legacy: {
      title: 'Lasting Legacy',
      content: 'Professor Yang was not only an outstanding theoretical physicist but also a bridge connecting scientific communities between East and West. His deep affection for his homeland and selfless dedication to science education inspired countless scholars. His academic achievements and personal integrity will be forever remembered in the annals of science.',
    },
    tribute: {
      title: 'Pay Tribute',
      candle: 'Light a Candle',
      flower: 'Send Flowers',
      sent: 'sent',
    },
  },
};

function App() {
  const [language, setLanguage] = useState<Language>('zh');
  const [theme, setTheme] = useState<Theme>('light');
  // 使用本地模拟数据
  const [candles, setCandles] = useState(50);  // 默认显示50个蜡烛
  const [flowers, setFlowers] = useState(20);  // 默认显示20朵鲜花
  const [sending, setSending] = useState<'candle' | 'flower' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = content[language];

  // 立即加载数据
  useEffect(() => {
    console.log('Component mounted, using local mock data');
    // 尝试从localStorage获取数据
    const savedCandles = localStorage.getItem('yzn_candles');
    const savedFlowers = localStorage.getItem('yzn_flowers');
    
    if (savedCandles) {
      setCandles(parseInt(savedCandles, 10));
    }
    
    if (savedFlowers) {
      setFlowers(parseInt(savedFlowers, 10));
    }
    
    // 不再尝试连接Supabase
    setError(null);
  }, []);

  const fetchTributes = () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching tributes from localStorage...');
      // 从localStorage获取数据
      const savedCandles = localStorage.getItem('yzn_candles');
      const savedFlowers = localStorage.getItem('yzn_flowers');
      
      // 设置数据，如果不存在则使用默认值
      setCandles(savedCandles ? parseInt(savedCandles, 10) : 50);
      setFlowers(savedFlowers ? parseInt(savedFlowers, 10) : 20);
      
      console.log('Tributes data loaded from localStorage');
    } catch (error) {
      console.error('Exception in fetchTributes:', error);
      setError(`获取数据异常: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 添加手动刷新函数
  const refreshData = () => {
    fetchTributes();
  };

  const sendTribute = (type: 'candle' | 'flower') => {
    setSending(type);
    
    try {
      // 更新本地状态
      if (type === 'candle') {
        setCandles(prev => {
          const newValue = prev + 1;
          // 保存到localStorage
          localStorage.setItem('yzn_candles', newValue.toString());
          return newValue;
        });
      } else {
        setFlowers(prev => {
          const newValue = prev + 1;
          // 保存到localStorage
          localStorage.setItem('yzn_flowers', newValue.toString());
          return newValue;
        });
      }
      
      console.log(`${type} tribute sent and saved to localStorage`);
    } catch (error) {
      console.error('Error sending tribute:', error);
      setError(`发送${type === 'candle' ? '蜡烛' : '鲜花'}失败: ${error}`);
    } finally {
      setTimeout(() => setSending(null), 1000);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200'
    }`}>
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(100,116,139,0.2),transparent_50%)]'
          : 'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.8),transparent_50%)]'
      }`} />

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {t.tribute.title}
          </h2>
          <div className="flex justify-center">
            <img
            src="/55.png" 
              alt="杨振宁教授" 
              className="w-64 h-64 object-cover rounded-lg shadow-lg mb-4"
            />
          </div>
        </div>
        
        <div className="absolute top-8 right-8 flex gap-2">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isDark
                ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              language === 'zh'
                ? isDark ? 'bg-slate-600 text-white shadow-lg' : 'bg-slate-800 text-white shadow-lg'
                : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow'
            }`}
          >
            <Globe size={18} />
            中文
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              language === 'en'
                ? isDark ? 'bg-slate-600 text-white shadow-lg' : 'bg-slate-800 text-white shadow-lg'
                : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow'
            }`}
          >
            <Globe size={18} />
            English
          </button>
        </div>

        <header className="text-center mb-16 pt-8">
          <div className={`w-32 h-32 mx-auto mb-8 rounded-full shadow-2xl flex items-center justify-center ${
            isDark
              ? 'bg-gradient-to-br from-slate-600 to-slate-800'
              : 'bg-gradient-to-br from-slate-700 to-slate-900'
          }`}>
            <span className="text-5xl font-serif text-white">杨</span>
          </div>
          <h1 className={`text-5xl font-serif font-bold mb-3 tracking-tight ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {t.title}
          </h1>
          <p className={`text-xl mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.subtitle}</p>
          <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.dates}</p>
          <div className="max-w-2xl mx-auto">
            <blockquote className={`text-xl italic border-l-4 pl-6 py-2 ${
              isDark
                ? 'text-slate-300 border-slate-500'
                : 'text-slate-700 border-slate-400'
            }`}>
              "{t.quote}"
            </blockquote>
          </div>
        </header>

        <div className="space-y-12">
          <section className={`backdrop-blur-sm rounded-2xl shadow-xl p-8 border ${
            isDark
              ? 'bg-slate-800/80 border-slate-700'
              : 'bg-white/80 border-slate-200'
          }`}>
            <h2 className={`text-3xl font-serif font-bold mb-6 border-b-2 pb-3 ${
              isDark
                ? 'text-slate-100 border-slate-600'
                : 'text-slate-900 border-slate-300'
            }`}>
              {t.biography.title}
            </h2>
            <div className="space-y-4 leading-relaxed">
              {t.biography.content.map((paragraph, index) => (
                <p key={index} className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <section className={`backdrop-blur-sm rounded-2xl shadow-xl p-8 border ${
            isDark
              ? 'bg-slate-800/80 border-slate-700'
              : 'bg-white/80 border-slate-200'
          }`}>
            <h2 className={`text-3xl font-serif font-bold mb-6 border-b-2 pb-3 ${
              isDark
                ? 'text-slate-100 border-slate-600'
                : 'text-slate-900 border-slate-300'
            }`}>
              {t.achievements.title}
            </h2>
            <ul className="space-y-4">
              {t.achievements.items.map((item, index) => (
                <li key={index} className={`flex items-start gap-3 text-lg ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    isDark ? 'bg-slate-400' : 'bg-slate-600'
                  }`} />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`rounded-2xl shadow-2xl p-8 ${
            isDark
              ? 'bg-gradient-to-br from-slate-700 to-slate-800'
              : 'bg-gradient-to-br from-slate-800 to-slate-900'
          }`}>
            <h2 className={`text-3xl font-serif font-bold mb-6 border-b-2 pb-3 ${
              isDark ? 'border-slate-500 text-slate-100' : 'border-slate-600 text-white'
            }`}>
              {t.legacy.title}
            </h2>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-white'}`}>
            {t.legacy.content}
          </p>
          </section>

          <section className={`mb-12 p-8 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-white/70'
          } backdrop-blur-sm shadow-xl`}>
            <div className="flex flex-col gap-6">
              <img src="/axbt3-jpxzf.svg" alt="杨振宁教授" className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-md" />
              <img src="/antq3-v33yv.svg" alt="纪念蜡烛" className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-md" />
              <img src="/ac72a-m9s9z.svg" alt="纪念鲜花" className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-md" />
              <img src="/av8xi-c1g47.svg" alt="杨振宁教授" className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-md" />
              <img src="/ady87-uj7n7.svg" alt="纪念蜡烛" className="w-full max-w-2xl mx-auto h-auto rounded-lg shadow-md" />
            </div>
          </section>

          <section className={`backdrop-blur-sm rounded-2xl shadow-xl p-8 border ${
            isDark
              ? 'bg-slate-800/80 border-slate-700'
              : 'bg-white/80 border-slate-200'
          }`}>
            <h2 className={`text-3xl font-serif font-bold mb-8 text-center ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              {t.tribute.title}
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <button 
                onClick={refreshData} 
                className={`ml-4 px-3 py-1 text-sm rounded-md ${
                  isDark 
                    ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                }`}
                disabled={loading}
              >
                {loading ? '加载中...' : '刷新数据'}
              </button>
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => sendTribute('candle')}
                disabled={sending !== null}
                className={`group relative flex flex-col items-center gap-3 px-8 py-6 rounded-xl transition-all transform hover:scale-105 ${
                  isDark
                    ? 'bg-amber-900/40 hover:bg-amber-900/60 border-2 border-amber-700'
                    : 'bg-amber-50 hover:bg-amber-100 border-2 border-amber-300'
                } ${sending === 'candle' ? 'scale-95' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <img src="/candle.svg" alt="蜡烛" className={`w-12 h-12 ${sending === 'candle' ? 'animate-pulse' : ''}`} />
                <span className={`text-lg font-medium ${
                  isDark ? 'text-amber-200' : 'text-amber-900'
                }`}>
                  {t.tribute.candle}
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  已送出: {candles.toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => sendTribute('flower')}
                disabled={sending !== null}
                className={`group relative flex flex-col items-center gap-3 px-8 py-6 rounded-xl transition-all transform hover:scale-105 ${
                  isDark
                    ? 'bg-rose-900/40 hover:bg-rose-900/60 border-2 border-rose-700'
                    : 'bg-rose-50 hover:bg-rose-100 border-2 border-rose-300'
                } ${sending === 'flower' ? 'scale-95' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <img src="/flower.svg" alt="鲜花" className={`w-12 h-12 ${sending === 'flower' ? 'animate-pulse' : ''}`} />
                <span className={`text-lg font-medium ${
                  isDark ? 'text-rose-200' : 'text-rose-900'
                }`}>
                  {t.tribute.flower}
                </span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  已送出: {flowers.toLocaleString()}
                </span>
              </button>
            </div>
          </section>
        </div>

        <footer className={`mt-16 text-center text-sm ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          <div className={`h-px bg-gradient-to-r from-transparent to-transparent mb-6 ${
            isDark ? 'via-slate-600' : 'via-slate-300'
          }`} />
          <p>© 2025 | {language === 'zh' ? '永远缅怀' : 'Forever Remembered'}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
