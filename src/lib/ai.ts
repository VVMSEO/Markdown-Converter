export async function generateContentWithAI(prompt: string): Promise<string> {
  const response = await fetch("https://routerai.ru/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer sk-idWLIk8WBHJJiwn-Y2oyMNdW0ckjsfIa",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4.6",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
