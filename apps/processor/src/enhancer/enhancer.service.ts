import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ProductEnhancementInput } from './dto/product-enhancement.dto';

@Injectable()
export class EnhancerService {
  private llm: OpenAI;
  private prompt: PromptTemplate;

  constructor(private readonly configService: ConfigService) {
    const openAIApiKey = this.configService.get<string>('OPEN_AI_API_KEY');
    this.llm = new OpenAI({
      openAIApiKey,
      temperature: 0.7,
      topP: 1,
    });
    this.prompt = new PromptTemplate({
      template: `
You are an expert in medical sales. Your specialty is medical consumables used by hospitals on a daily basis. Your task to enhance the description of a product based on the information provided.

Product name: {productName}
Product description: {description}
Category: {category}

New Description:
      `,
      inputVariables: ['productName', 'description', 'category'],
    });
  }

  async enhanceProductDescription(
    input: ProductEnhancementInput,
  ): Promise<string> {
    const result = await this.prompt
      .pipe(this.llm)
      .pipe(new StringOutputParser())
      .invoke({
        productName: input.productName,
        description: input.description,
        category: input.category,
      });

    return result;
  }
}
