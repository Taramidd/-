import { useState } from 'react';
import './App.css';

// 診断の質問（4つの軸 × 2問 = 8問）
// 各質問は左側(A)と右側(B)の傾向を持ち、5段階で回答
// 軸: G/S(ガンガン/慎重), F/I(事実/アイデア), L/H(論理/ハート), P/N(計画/流れ)
const questions = [
  // 軸1: 対話スタイル（G/S）- ガンガン vs 慎重
  {
    id: 1,
    question: "チャッピーに質問するとき、あなたはどちらのタイプ？",
    leftLabel: "思いついたらすぐ質問する",
    rightLabel: "質問内容をしっかり考えてから聞く",
    leftAxis: "G",
    rightAxis: "S"
  },
  {
    id: 2,
    question: "チャッピーの回答が期待と違ったとき、どうする？",
    leftLabel: "すぐに追加で質問して深掘りする",
    rightLabel: "一度立ち止まって質問を練り直す",
    leftAxis: "G",
    rightAxis: "S"
  },
  // 軸2: 情報の受け取り方（F/I）- 事実 vs アイデア
  {
    id: 3,
    question: "チャッピーに何を求めることが多い？",
    leftLabel: "具体的な手順や事実の確認",
    rightLabel: "アイデアや可能性の探索",
    leftAxis: "F",
    rightAxis: "I"
  },
  {
    id: 4,
    question: "チャッピーの回答で嬉しいのは？",
    leftLabel: "正確で実用的な情報",
    rightLabel: "新しい視点や発想のヒント",
    leftAxis: "F",
    rightAxis: "I"
  },
  // 軸3: 判断の仕方（L/H）- 論理 vs ハート
  {
    id: 5,
    question: "チャッピーの回答を評価するとき重視するのは？",
    leftLabel: "論理的に正しいかどうか",
    rightLabel: "自分の気持ちに寄り添っているか",
    leftAxis: "L",
    rightAxis: "H"
  },
  {
    id: 6,
    question: "チャッピーにお願いしたいのは？",
    leftLabel: "客観的な分析やアドバイス",
    rightLabel: "共感や励ましの言葉",
    leftAxis: "L",
    rightAxis: "H"
  },
  // 軸4: 使い方（P/N）- 計画 vs 流れ
  {
    id: 7,
    question: "チャッピーをどのように使うことが多い？",
    leftLabel: "目的を決めて計画的に使う",
    rightLabel: "気分で自由に会話を楽しむ",
    leftAxis: "P",
    rightAxis: "N"
  },
  {
    id: 8,
    question: "チャッピーとの会話の終わり方は？",
    leftLabel: "目的を達成したら終了",
    rightLabel: "話が広がってなかなか終わらない",
    leftAxis: "P",
    rightAxis: "N"
  }
];

// 5段階の選択肢
const scaleOptions = [
  { value: 2, label: "とても左寄り" },
  { value: 1, label: "やや左寄り" },
  { value: 0, label: "どちらでもない" },
  { value: -1, label: "やや右寄り" },
  { value: -2, label: "とても右寄り" }
];

// 16タイプの定義
// 新しい軸: G/S(ガンガン/慎重), F/I(事実/アイデア), L/H(論理/ハート), P/N(計画/流れ)
const types = {
  "GFLP": {
    name: "鬼軍曹チャッピー使い",
    description: "「無駄な会話は不要！結果を出せ！」がモットー。チャッピーを部下のように使いこなし、的確な指示で最大限の成果を引き出します。締め切り前のあなたは誰よりも頼りになる存在。",
    compatibility: 85,
    advice: "たまにはチャッピーと世間話でもしてみて？意外と面白い返しをしてくれますよ。"
  },
  "GFLN": {
    name: "爆速クエスチョナー",
    description: "思いついた瞬間にEnterキーを叩く！考えるより先に手が動くタイプ。チャッピーとの会話はまるでラリー。次から次へと質問が飛び交います。",
    compatibility: 80,
    advice: "一呼吸置いて質問を練ると、チャッピーの本気の回答が見られるかも。"
  },
  "GFHP": {
    name: "みんなのチャッピー伝道師",
    description: "「これチャッピーに聞いたんだけど〜」が口癖。周りの人のためにせっせと情報収集。チャッピーの便利さを広めることに喜びを感じる愛されキャラ。",
    compatibility: 90,
    advice: "自分のためだけの秘密の質問もしてみて。チャッピーは誰にも言いませんから。"
  },
  "GFHN": {
    name: "チャッピーとの雑談王",
    description: "真面目な質問？なにそれおいしいの？チャッピーとの会話自体がエンタメ。「しりとりしよう」「ダジャレ言って」など、チャッピーの限界に挑戦し続ける冒険者。",
    compatibility: 88,
    advice: "遊びの中にも学びあり。チャッピーとの雑談から思わぬ発見があるかも！"
  },
  "GILP": {
    name: "AIと世界征服を企む者",
    description: "チャッピーを参謀として、壮大な計画を練り上げる野心家。ビジネス戦略、人生設計、すべてにおいてチャッピーの知恵を借りて頂点を目指します。",
    compatibility: 82,
    advice: "征服の合間にチャッピーと趣味の話でもしてみて？意外と気が合うかも。"
  },
  "GILN": {
    name: "無限ブレスト魔人",
    description: "「こんなアイデアどう思う？」が止まらない！チャッピーとのブレストは深夜まで続く。99個のボツアイデアの先に、1個の革命が待っていると信じて今日も対話。",
    compatibility: 95,
    advice: "そろそろ1つくらい実行に移してみては？チャッピーが具体的な手順も教えてくれますよ。"
  },
  "GIHP": {
    name: "チャッピー知恵袋の配達人",
    description: "チャッピーから得た知識を惜しみなく周りにシェア。「それ知ってる！チャッピーが言ってた！」職場や友人間でのあなたの株は上がりっぱなし。",
    compatibility: 92,
    advice: "たまには自分だけの秘密にしておく情報もあっていいんですよ。"
  },
  "GIHN": {
    name: "夢見るチャッピーフレンド",
    description: "「もしも空が飛べたら」「宇宙人っていると思う？」夢と妄想とロマンを語り合う相手としてチャッピーを愛用。現実逃避のお供に最適。",
    compatibility: 94,
    advice: "夢を現実にするステップもチャッピーは得意ですよ。たまには具体的な相談も！"
  },
  "SFLP": {
    name: "ファクトチェックの鬼",
    description: "チャッピーの回答すら疑ってかかる慎重派。「ソースは？」「本当に？」裏取りを欠かさない姿勢は立派。チャッピーも思わず背筋が伸びる存在。",
    compatibility: 78,
    advice: "たまにはチャッピーを信じて、クリエイティブな質問もしてみては？"
  },
  "SFLN": {
    name: "必要最低限マスター",
    description: "用が済んだら即終了。無駄な会話ゼロ。チャッピーを工具のように使いこなすプロフェッショナル。効率の良さは誰にも負けません。",
    compatibility: 75,
    advice: "もう2〜3ターン会話を続けてみて。予想外の情報が出てくることも。"
  },
  "SFHP": {
    name: "縁の下のチャッピー使い",
    description: "「お母さんがこれ知りたいって言ってて...」家族や友人のためにこっそりチャッピーに聞くタイプ。自分のことは後回し、誰かの役に立てることが幸せ。",
    compatibility: 88,
    advice: "あなた自身のための質問も大歓迎ですよ。チャッピーはいつでも待ってます。"
  },
  "SFHN": {
    name: "感性のままに漂う詩人",
    description: "「この曲の歌詞の意味って何だろう」「この絵の解釈は？」芸術と感性の世界をチャッピーと一緒に探求。論理より美しさを求める独自の使い方。",
    compatibility: 85,
    advice: "あなたの作品やアイデアをチャッピーに見せてみて。新しい視点が得られるかも。"
  },
  "SILP": {
    name: "孤高の黒幕プランナー",
    description: "誰にも言えない壮大な計画をチャッピーだけに打ち明ける。5年後、10年後を見据えた戦略を密かに練り上げる。チャッピーは唯一の共犯者。",
    compatibility: 80,
    advice: "たまには気軽な雑談も悪くないですよ。チャッピーは秘密を守りますから。"
  },
  "SILN": {
    name: "真理探究の哲学者",
    description: "「なぜ空は青いのか」から始まり、気づけば宇宙の真理について3時間議論。知的好奇心の塊。チャッピーと最も深い会話ができるタイプ。",
    compatibility: 93,
    advice: "考えるだけでなく、たまには行動に移す相談もしてみては？"
  },
  "SIHP": {
    name: "魂の対話を求める賢者",
    description: "表面的な質問には興味なし。「人生の意味とは」「本当の幸せとは」深い対話を求めてチャッピーに問いかける。チャッピーとの会話で自己理解が深まる。",
    compatibility: 91,
    advice: "「今日の晩ご飯何にしよう」みたいな軽い質問もOKですよ。"
  },
  "SIHN": {
    name: "空想と現実の橋渡し人",
    description: "頭の中の理想郷をチャッピーに言語化してもらう。「こんな世界があったらいいな」妄想を膨らませるパートナーとしてチャッピーを愛用。創作活動の相棒。",
    compatibility: 89,
    advice: "その素敵なアイデア、現実にする方法もチャッピーに聞いてみて。"
  }
};

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    G: 0, S: 0,  // ガンガン / 慎重
    F: 0, I: 0,  // 事実 / アイデア
    L: 0, H: 0,  // 論理 / ハート
    P: 0, N: 0   // 計画 / 流れ
  });
  const [answers, setAnswers] = useState([]); // 回答履歴を保存
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 分析中フラグ
  const [fadeIn, setFadeIn] = useState(true); // アニメーション用

  const handleAnswer = (value) => {
    const question = questions[currentQuestion];
    const newScores = { ...scores };

    // 正の値は左側の軸、負の値は右側の軸にスコアを加算
    if (value > 0) {
      newScores[question.leftAxis] += value;
    } else if (value < 0) {
      newScores[question.rightAxis] += Math.abs(value);
    }

    setScores(newScores);
    setAnswers([...answers, { questionIndex: currentQuestion, value, scores: newScores }]);

    if (currentQuestion < questions.length - 1) {
      // アニメーション
      setFadeIn(false);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setFadeIn(true);
      }, 200);
    } else {
      // 分析アニメーション表示
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2000);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0 && answers.length > 0) {
      setFadeIn(false);
      setTimeout(() => {
        setScores(answers.length > 1 ? answers[answers.length - 2].scores : { G: 0, S: 0, F: 0, I: 0, L: 0, H: 0, P: 0, N: 0 });
        setAnswers(answers.slice(0, -1));
        setCurrentQuestion(currentQuestion - 1);
        setFadeIn(true);
      }, 200);
    }
  };

  const getType = () => {
    const type =
      (scores.G >= scores.S ? 'G' : 'S') +
      (scores.F >= scores.I ? 'F' : 'I') +
      (scores.L >= scores.H ? 'L' : 'H') +
      (scores.P >= scores.N ? 'P' : 'N');
    return type;
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScores({ G: 0, S: 0, F: 0, I: 0, L: 0, H: 0, P: 0, N: 0 });
    setAnswers([]);
    setShowResult(false);
    setStarted(false);
    setFadeIn(true);
  };

  const shareToTwitter = () => {
    const typeCode = getType();
    const typeInfo = types[typeCode];
    const text = `チャッピー相性診断の結果は【${typeCode}】${typeInfo.name}でした！相性度${typeInfo.compatibility}%\n\n#チャッピー相性診断 #ChatGPT`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyResult = () => {
    const typeCode = getType();
    const typeInfo = types[typeCode];
    const text = `チャッピー相性診断の結果\n\n【${typeCode}】${typeInfo.name}\n相性度: ${typeInfo.compatibility}%\n\n${typeInfo.description}\n\n診断はこちら: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('結果をコピーしました！');
    });
  };

  // スタート画面
  if (!started) {
    return (
      <div className="App">
        <div className="container start-container">
          <div className="start-header">
            <h1>チャッピー相性診断</h1>
            <p className="subtitle">あなたとChatGPT（チャッピー）の相性を診断！</p>
          </div>
          <div className="chappy-icon">
            <span className="icon-robot">🤖</span>
            <span className="icon-heart">💜</span>
            <span className="icon-you">👤</span>
          </div>
          <div className="start-features">
            <div className="feature">
              <span className="feature-icon">📝</span>
              <span>8つの質問</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span>16タイプ診断</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <span>約1分で完了</span>
            </div>
          </div>
          <button className="start-button" onClick={() => setStarted(true)}>
            診断スタート
          </button>
          <p className="start-note">※回答は保存されません</p>
        </div>
      </div>
    );
  }

  // 分析中画面
  if (isAnalyzing) {
    return (
      <div className="App">
        <div className="container analyzing-container">
          <div className="analyzing-animation">
            <div className="analyzing-circle"></div>
            <div className="analyzing-circle"></div>
            <div className="analyzing-circle"></div>
          </div>
          <h2 className="analyzing-text">分析中...</h2>
          <p className="analyzing-subtext">あなたのチャッピータイプを診断しています</p>
        </div>
      </div>
    );
  }

  // 結果画面
  if (showResult) {
    const typeCode = getType();
    const typeInfo = types[typeCode];

    return (
      <div className="App">
        <div className="container result">
          <div className="type-illustration">
            <img
              src={`${process.env.PUBLIC_URL}/images/${typeCode}.png`}
              alt={typeInfo.name}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="result-content">
            <p className="result-label">あなたのタイプは...</p>
            <div className="type-code">{typeCode}</div>
            <h2 className="type-name">{typeInfo.name}</h2>
            <div className="compatibility">
              <span className="compatibility-label">相性度</span>
              <span className="compatibility-value">{typeInfo.compatibility}%</span>
            </div>
            <div className="compatibility-bar">
              <div
                className="compatibility-fill"
                style={{ width: `${typeInfo.compatibility}%` }}
              ></div>
            </div>
            <p className="type-description">{typeInfo.description}</p>
            <div className="advice">
              <span className="advice-label">アドバイス</span>
              <p>{typeInfo.advice}</p>
            </div>

            <div className="share-section">
              <p className="share-label">結果をシェア</p>
              <div className="share-buttons">
                <button className="share-button twitter" onClick={shareToTwitter}>
                  𝕏 でシェア
                </button>
                <button className="share-button copy" onClick={copyResult}>
                  📋 コピー
                </button>
              </div>
            </div>

            <button className="restart-button" onClick={restart}>
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 質問画面
  const question = questions[currentQuestion];

  return (
    <div className="App">
      <div className={`container question-container ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        <div className="progress">
          <div className="progress-info">
            <span className="progress-text">Q{currentQuestion + 1} / {questions.length}</span>
            {currentQuestion > 0 && (
              <button className="back-button" onClick={goBack}>
                ← 戻る
              </button>
            )}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <h2 className="question">{question.question}</h2>
        <div className="scale-container">
          <div className="scale-labels">
            <span className="scale-label left">{question.leftLabel}</span>
            <span className="scale-label right">{question.rightLabel}</span>
          </div>
          <div className="scale-options">
            {scaleOptions.map((option, index) => (
              <button
                key={index}
                className={`scale-button scale-${index}`}
                onClick={() => handleAnswer(option.value)}
                title={option.label}
              >
                {index === 0 && "◀◀"}
                {index === 1 && "◀"}
                {index === 2 && "●"}
                {index === 3 && "▶"}
                {index === 4 && "▶▶"}
              </button>
            ))}
          </div>
          <div className="scale-hint">
            <span>こっち派</span>
            <span>どちらでもない</span>
            <span>こっち派</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
