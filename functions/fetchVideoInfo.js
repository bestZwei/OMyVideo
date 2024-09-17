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
    const data = await apiResponse.json();

    if (!apiResponse.ok || data.code !== '200') {
      return new Response(JSON.stringify({ error: 'API 请求失败' }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '解析失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
