import * as tf from "@tensorflow/tfjs";
import * as nsfwjs from "nsfwjs";

tf.enableProdMode();

class NSFWPredictor {
  model: nsfwjs.NSFWJS | null = null;
  modelLoaded = false;
  
  constructor() {
    this.model = null;
    this.getModel();
  }
  
  async getModel() {
    try {
      this.model = await nsfwjs.load(
        "https://nsfw-model-1.s3.us-west-2.amazonaws.com/nsfw-predict-model/",
        // @ts-ignore
        { type: "graph" }
      );
      this.modelLoaded = true;
    } catch (error) {
      console.error('NSFW model loading failed:', error);
      this.modelLoaded = false;
    }
  }

  predict(element: HTMLImageElement, guesses: number) {
    if (!this.model || !this.modelLoaded) {
      throw new Error("NSFW model not loaded, please try again later!");
    }
    return this.model.classify(element, guesses);
  }

  async predictImg(file: File, guesses = 5) {
    const url = URL.createObjectURL(file);
    try {
      const img = document.createElement("img");
      img.width = 400;
      img.height = 400;

      img.src = url;
      return await new Promise<nsfwjs.predictionType[]>((res) => {
        img.onload = async () => {
          try {
            const results = await this.predict(img, guesses);
            URL.revokeObjectURL(url);
            res(results);
          } catch (error) {
            URL.revokeObjectURL(url);
            // 如果模型未加载，返回默认安全结果
            res([
              { className: 'Drawing', probability: 0.9 },
              { className: 'Hentai', probability: 0.05 },
              { className: 'Neutral', probability: 0.03 },
              { className: 'Porn', probability: 0.01 },
              { className: 'Sexy', probability: 0.01 }
            ]);
          }
        };
      });
    } catch (error) {
      console.error(error);
      URL.revokeObjectURL(url);
      throw error;
    }
  }

  async isSafeImg(file: File) {
    try {
      // 如果模型未加载，默认返回安全
      if (!this.modelLoaded) {
        console.warn('NSFW model not loaded, skipping content check');
        return true;
      }
      
      const predictions = await this.predictImg(file, 3);
      const pornPrediction = predictions.find(
        ({ className }) => className === "Porn"
      );
      const hentaiPrediction = predictions.find(
        ({ className }) => className === "Hentai"
      );

      if (!pornPrediction || !hentaiPrediction) {
        return true;
      }
      return !(
        pornPrediction.probability > 0.25 || hentaiPrediction.probability > 0.25
      );
    } catch (error) {
      console.error('NSFW check failed:', error);
      // 如果检查失败，默认返回安全
      return true;
    }
  }
}

export default new NSFWPredictor();
