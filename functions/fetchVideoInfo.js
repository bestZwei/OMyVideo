export async function onRequest(context) {
  const { request } = context;
  let videoUrl;

  try {
    const requestBody = await request.json();
    videoUrl = requestBody.url;
  } catch (e) {
    return new Response(JSON.stringify({ error: '请求体解析错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!videoUrl) {
    return new Response(JSON.stringify({ error: 'URL 缺失' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiUrl = `https://api.shenke.love/api/jhjx.php?url=${encodeURIComponent(videoUrl)}`;

  try {
    // GET 请求
    const apiResponse = await fetch(apiUrl, {
      method: 'GET'
    });
    const contentType = apiResponse.headers.get('content-type');
    const text = await apiResponse.text();

    console.log('API 返回内容:', text);

    if (!contentType || !contentType.includes('application/json')) {
      console.error('API 返回内容不是 JSON，返回内容：', text);
      return new Response(JSON.stringify({ error: `无效的 API 返回内容: ${text}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = JSON.parse(text);

    if (data.code !== '200') {
      console.error('API 请求失败，返回状态码不正确，返回数据:', data);
      return new Response(JSON.stringify({ error: data.msg || 'API 请求失败' }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('捕获到的错误:', error);
    return new Response(JSON.stringify({ error: `解析失败，请检查链接或稍后再试: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
