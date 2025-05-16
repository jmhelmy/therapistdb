// src/lib/ai.ts

export async function rankTherapistsByIssue(issue: string, therapists: any[]) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/rank-therapists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue, therapists }),
        cache: 'no-store'
      });
  
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `AI request failed: ${response.status}`);
      }
  
      return await response.json();
    } catch (error: any) {
      console.error('[AI] Ranking failed:', error.message);
      return { ranked: [], error: error.message };
    }
  }
  