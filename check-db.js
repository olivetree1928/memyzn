import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('缺少环境变量: VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  try {
    console.log('正在检查数据库连接...');
    
    // 查询yzn_tributes表中的数据
    const { data, error } = await supabase
      .from('yzn_tributes')
      .select('*');
    
    if (error) {
      console.error('数据库查询错误:', error);
      return;
    }
    
    console.log('数据库中的数据:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data && data.length > 0) {
      const record = data[0];
      console.log(`\n当前计数:`);
      console.log(`蜡烛: ${record.candles}`);
      console.log(`鲜花: ${record.flowers}`);
      console.log(`最后更新: ${record.updated_at}`);
    } else {
      console.log('数据库中没有数据');
    }
    
  } catch (err) {
    console.error('检查数据库时出错:', err);
  }
}

checkDatabase();