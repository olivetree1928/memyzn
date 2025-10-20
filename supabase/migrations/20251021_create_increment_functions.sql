-- 创建增加蜡烛计数的函数
CREATE OR REPLACE FUNCTION increment_candles()
RETURNS void AS $$
BEGIN
  UPDATE yzn_tributes
  SET candles = candles + 1,
      updated_at = now()
  WHERE id = (SELECT id FROM yzn_tributes LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- 创建增加鲜花计数的函数
CREATE OR REPLACE FUNCTION increment_flowers()
RETURNS void AS $$
BEGIN
  UPDATE yzn_tributes
  SET flowers = flowers + 1,
      updated_at = now()
  WHERE id = (SELECT id FROM yzn_tributes LIMIT 1);
END;
$$ LANGUAGE plpgsql;