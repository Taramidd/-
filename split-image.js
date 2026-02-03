const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// 入力画像のパス
const inputPath = 'C:/Users/gackt/OneDrive/Desktop/Gemini_Generated_Image_8yj0c28yj0c28yj0.png';
// 出力先
const outputDir = './public/images';

// 4x4グリッドのタイプコード（左上から右へ、上から下へ）
const typeOrder = [
  'GFLP', 'GFLN', 'GFHP', 'GFHN',
  'GILP', 'GILN', 'GIHP', 'GIHN',
  'SFLP', 'SFLN', 'SFHP', 'SFHN',
  'SILP', 'SILN', 'SIHP', 'SIHN'
];

async function splitImage() {
  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 画像のメタデータを取得
  const metadata = await sharp(inputPath).metadata();
  const { width, height } = metadata;

  console.log(`元画像サイズ: ${width} x ${height}`);

  // 4x4グリッドなので、各セルのサイズを計算
  const cellWidth = Math.floor(width / 4);
  const cellHeight = Math.floor(height / 4);

  console.log(`各セルサイズ: ${cellWidth} x ${cellHeight}`);

  // 16個の画像に分割
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      const typeCode = typeOrder[index];

      const left = col * cellWidth;
      const top = row * cellHeight;

      const outputPath = path.join(outputDir, `${typeCode}.png`);

      await sharp(inputPath)
        .extract({
          left: left,
          top: top,
          width: cellWidth,
          height: cellHeight
        })
        .toFile(outputPath);

      console.log(`${typeCode}.png を作成しました`);
    }
  }

  console.log('\n全ての画像を分割しました！');
}

splitImage().catch(err => {
  console.error('エラーが発生しました:', err);
});
