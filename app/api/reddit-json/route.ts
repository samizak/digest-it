import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { redditUrl } = await request.json();
    
    // Extract post ID from the URL
    const postIdMatch = redditUrl.match(/\/comments\/([a-zA-Z0-9]+)/i);
    if (!postIdMatch) {
      return NextResponse.json(
        { error: 'Could not extract post ID from the provided URL' },
        { status: 400 }
      );
    }
    
    const postId = postIdMatch[1];
    const jsonUrl = `https://www.reddit.com/comments/${postId}.json`;
    
    // Fetch data from Reddit's JSON API
    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'web:digest-it:v1.0 (by /u/your_username)'
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch Reddit data: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in reddit-json API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}