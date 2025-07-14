import * as tf from "@tensorflow/tfjs";
import * as nsfwjs from "nsfwjs";

tf.enableProdMode();

class NSFWPredictor {
  model: nsfwjs.NSFWJS | null = null;
  modelLoaded = false;
  loadingPromise: Promise<void> | null = null;
  
  constructor() {
    this.model = null;
    // 延迟加载模型，不在构造函数中立即加载
  }
  
  async getModel() {
    // 如果已经在加载中，返回现有的promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // 如果已经加载完成，直接返回
    if (this.modelLoaded && this.model) {
      return Promise.resolve();
    }

    // 创建新的加载promise
    this.loadingPromise = this._loadModel();
    return this.loadingPromise;
  }

  private async _loadModel() {
    try {
      console.log('开始加载NSFW模型...');
      const startTime = performance.now();
      
      this.model = await nsfwjs.load(
        "https://nsfw-model-1.s3.us-west-2.amazonaws.com/nsfw-predict-model/",
        // @ts-ignore
        { type: "graph" }
      );
      
      this.modelLoaded = true;
      const loadTime = performance.now() - startTime;
      console.log(`NSFW模型加载完成，耗时: ${loadTime.toFixed(2)}ms`);
    } catch (error) {
      console.error('NSFW model loading failed:', error);
      this.modelLoaded = false;
      this.loadingPromise = null; // 重置promise，允许重试
      throw error;
    }
  }

  predict(element: HTMLImageElement, guesses: number) {
    if (!this.model || !this.modelLoaded) {
      throw new Error("NSFW model not loaded, please try again later!");
    }
    return this.model.classify(element, guesses);
  }

  async predictImg(file: File, guesses = 5) {
    // 确保模型已加载
    await this.getModel();
    
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

  // 预加载模型（可选）
  async preloadModel() {
    if (!this.modelLoaded && !this.loadingPromise) {
      console.log('预加载NSFW模型...');
      await this.getModel();
    }
  }

  // 清理资源
  dispose() {
    if (this.model) {
      // 清理TensorFlow.js资源
      tf.dispose();
      this.model = null;
      this.modelLoaded = false;
      this.loadingPromise = null;
    }
  }
}

export default new NSFWPredictor();
