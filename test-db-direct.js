import { createClient } from '@supabase/supabase-js';

// 直接使用提供的数据库连接信息
const supabaseUrl = 'https://muclhettdgywigkgfccy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Y2xoZXR0ZGd5d2lna2dmY2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjU5MTksImV4cCI6MjA3NjUwMTkxOX0.thDJD6r7L52SRlACkIUZ5T2oMnzPnJ05AeSfqxmOYQ0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('=== 开始数据库连接测试 ===');
  
  try {
    // 1. 测试基本连接
    console.log('\n1. 测试数据库连接...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tributes')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ 数据库连接失败:', connectionError);
      return;
    }
    console.log('✅ 数据库连接成功');
    
    // 2. 检查表结构
    console.log('\n2. 检查表结构...');
    const { data: tableData, error: tableError } = await supabase
      .from('tributes')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ 表查询失败:', tableError);
      return;
    }
    console.log('✅ 表结构正常，示例数据:', tableData);
    
    // 3. 获取当前数据
    console.log('\n3. 获取当前数据...');
    const { data: currentData, error: fetchError } = await supabase
      .from('tributes')
      .select('id, candles, flowers, updated_at')
      .single();
    
    if (fetchError) {
      console.error('❌ 数据获取失败:', fetchError);
      
      // 如果没有数据，尝试插入初始数据
      console.log('\n尝试插入初始数据...');
      const { data: insertData, error: insertError } = await supabase
        .from('tributes')
        .insert({ candles: 0, flowers: 0 })
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ 插入初始数据失败:', insertError);
        return;
      }
      console.log('✅ 初始数据插入成功:', insertData);
      return;
    }
    
    console.log('✅ 当前数据:', currentData);
    
    // 4. 测试数据更新
    console.log('\n4. 测试数据更新...');
    const newCandleCount = (currentData.candles || 0) + 1;
    const { data: updateData, error: updateError } = await supabase
      .from('tributes')
      .update({ 
        candles: newCandleCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentData.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ 数据更新失败:', updateError);
      return;
    }
    console.log('✅ 数据更新成功:', updateData);
    
    // 5. 验证更新后的数据
    console.log('\n5. 验证更新后的数据...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('tributes')
      .select('id, candles, flowers, updated_at')
      .single();
    
    if (verifyError) {
      console.error('❌ 数据验证失败:', verifyError);
      return;
    }
    console.log('✅ 验证成功，最新数据:', verifyData);
    
    console.log('\n=== 数据库测试完成 ===');
    console.log('🎉 所有测试通过！数据库连接和操作正常。');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

testDatabase();