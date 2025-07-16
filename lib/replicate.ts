export const replicate = {
  run: async (model: string, options: any) => {
    // mock: 返回原图url，实际应调用Replicate API
    return options.input.img;
  }
}; 