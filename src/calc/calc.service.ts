import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const expression = calcBody.expression.replace(/\s+/g, '');
    if (!expression) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }

    const validExpressionRegex = /^-?\d+(\.\d+)?([-+*/]-?\d+(\.\d+)?)*$/;
    if (!validExpressionRegex.test(expression)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }

    const valueStack: number[] = [];
    let currentNumber = 0;
    let currentOperator = '+';

    for (let i = 0; i < expression.length; i++) {
      const currentChar = expression[i];

      if (!isNaN(parseInt(currentChar))) {
        currentNumber = currentNumber * 10 + parseInt(currentChar);
      }

      if (isNaN(parseInt(currentChar)) || i === expression.length - 1) {
        switch (currentOperator) {
          case '+':
            valueStack.push(currentNumber);
            break;
          case '-':
            valueStack.push(-currentNumber);
            break;
          case '*':
            valueStack.push(valueStack.pop() * currentNumber);
            break;
          case '/':
            valueStack.push(Math.trunc(valueStack.pop() / currentNumber));
            break;
        }
        currentOperator = currentChar;
        currentNumber = 0;
      }
    }

    const finalResult = valueStack.reduce((sum, value) => sum + value, 0);
    return { result: finalResult };
  }
}

