export enum AIModel {
  GPT_5 = 'gpt-5',
  GPT_4_1 = 'gpt-4-1',
  GPT_4o = 'gpt-4o',
  DEEPSEEK_R1 = 'deepseek-r1',
  DEEPSEEK_V3 = 'deepseek-v3',
  CLAUDE_3_7_SONNET = 'claude',
  GEMINI_2_5_FLASH = 'gemini-2-5-flash',
  GEMINI_2_5_FLASH_LITE = 'gemini-2-5-flash-lite',
}

export enum AIModelResponseFormat {
  TEXT = '{"type":"text"}',
  JSON = '{"type":"json"}',
}
