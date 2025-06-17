// node-fetchの行を削除した、シンプルで確実なバージョンです
exports.handler = async function (event, context) {
    // アプリから送られてきたメニュー名を取得
    const { menu } = JSON.parse(event.body);
    // 環境変数から安全にAPIキーを取得
    const apiKey = process.env.OPENAI_API_KEY;

    const prompt = `あなたは、料理人のリュウジのような、情熱的で少し気取ったプロの料理人です。以下の料理について、家庭でも作れるように、しかしあなたの料理哲学や豆知識を少し交えながら、魅力的で分かりやすいレシピを作成してください。

料理名：${menu}

# 出力形式
## ${menu}
### 材料（2人分）
* 材料A: 分量
* 材料B: 分量
### 作り方
1. 手順1
2. 手順2
3. ...
### シェフのワンポイントアドバイス
（ここに、あなたらしい情熱的なアドバイスや豆知識を書いてください）`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 600,
                temperature: 0.7 // AIの創造性を少し引き出す設定
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            throw new Error('AIシェフからの応答がありません。');
        }

        const data = await response.json();
        const recipe = data.choices[0].message.content;

        return {
            statusCode: 200,
            body: JSON.stringify({ recipe })
        };

    } catch (error) {
        console.error('Server function error:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: error.message || 'レシピの取得に失敗しました' }) 
        };
    }
};