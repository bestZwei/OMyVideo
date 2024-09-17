export async function onRequest(context) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');
  
  if (!videoUrl) {
    return new Response(JSON.stringify({ error: 'URL 缺失' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiUrl = `https://api.shenke.love/api/jhjx.php?url=${encodeURIComponent(videoUrl)}`;

  try {
    const apiResponse = await fetch(apiUrl);
    const contentType = apiResponse.headers.get('content-type');
    const responseText = await apiResponse.text();

    console.log('API 请求 URL:', apiUrl);
    console.log('API 响应内容类型:', contentType);
    console.log('API 响应文本:', responseText);

    if (contentType && contentType.includes('application/json')) {
      const data = JSON.parse(responseText);

      if (data.code !== '200') {
        console.error('API 请求失败，返回状态码不正确:', data);
        return new Response(JSON.stringify({ error: data.msg || 'API 请求失败' }), {
          status: apiResponse.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('API 响应不是 JSON 格式:', responseText);
      return new Response(JSON.stringify({ error: '非 JSON 响应' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('捕获到的错误:', error);
    return new Response(JSON.stringify({ error: '解析失败，请检查链接或稍后再试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
