import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function initializeDatabase() {
  // 从环境变量获取Supabase URL和匿名密钥
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('缺少Supabase配置信息');
    process.exit(1);
  }

  // 创建Supabase客户端
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 执行SQL命令创建表
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS yzn_tributes (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          candles integer DEFAULT 0,
          flowers integer DEFAULT 0,
          updated_at timestamptz DEFAULT now()
        );
        
        -- Insert initial record
        INSERT INTO yzn_tributes (candles, flowers)
        VALUES (0, 0)
        ON CONFLICT DO NOTHING;
        
        -- Enable RLS
        ALTER TABLE yzn_tributes ENABLE ROW LEVEL SECURITY;
        
        -- Allow everyone to read tribute counts
        CREATE POLICY "Anyone can view tribute counts"
          ON yzn_tributes
          FOR SELECT
          TO public
          USING (true);
        
        -- Allow anyone to update tribute counts
        CREATE POLICY "Anyone can send tributes"
          ON yzn_tributes
          FOR UPDATE
          TO public
          USING (true);
      `
    });

    if (error) {
      console.error('初始化数据库失败:', error);
      process.exit(1);
    }

    console.log('数据库初始化成功!');
    
    // 验证表是否创建成功
    const { data: tributes, error: selectError } = await supabase
      .from('yzn_tributes')
      .select('*');
    
    if (selectError) {
      console.error('验证表失败:', selectError);
    } else {
      console.log('表验证成功，当前数据:', tributes);
    }
  } catch (err) {
    console.error('执行过程中出错:', err);
    process.exit(1);
  }
}

initializeDatabase();