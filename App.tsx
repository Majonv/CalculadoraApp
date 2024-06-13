

import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  const [currentInput, setCurrentInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');

  const handlePress = (value: string) => {
    setCurrentInput(currentInput + value);
  };

  const clearInput = () => {
    setCurrentInput('');
    setResult('');
  };

  const calculateResult = () => {
    try {
      const evaluatedResult = evaluateExpression(currentInput);
      setResult(evaluatedResult.toString());
      setHistory([`${currentInput} = ${evaluatedResult}`, ...history].slice(0, 30));
      setCurrentInput('');
    } catch (error) {
      setResult('Error');
    }
  };

  const evaluateExpression = (expression: string): number => {
    const operators = {
      '+': (a: number, b: number) => a + b,
      '-': (a: number, b: number) => a - b,
      '*': (a: number, b: number) => a * b,
      '/': (a: number, b: number) => a / b,
      '^': (a: number, b: number) => Math.pow(a, b),
    };

    type Operator = '+' | '-' | '*' | '/' | '^';

    const isOperator = (token: string): token is Operator => ['+', '-', '*', '/', '^'].includes(token);

    const toPostfix = (infix: string): string[] => {
      const precedence: Record<Operator, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
      const stack: string[] = [];
      const output: string[] = [];
      const tokens = infix.match(/(\d+|\+|\-|\*|\/|\^)/g) || [];

      tokens.forEach(token => {
        if (/\d/.test(token)) {
          output.push(token);
        } else if (isOperator(token)) {
          while (stack.length && precedence[stack[stack.length - 1] as Operator] >= precedence[token]) {
            output.push(stack.pop()!);
          }
          stack.push(token);
        }
      });

      while (stack.length) {
        output.push(stack.pop()!);
      }

      return output;
    };

    const evaluatePostfix = (postfix: string[]): number => {
      const stack: number[] = [];

      postfix.forEach(token => {
        if (/\d/.test(token)) {
          stack.push(parseFloat(token));
        } else if (isOperator(token)) {
          const b = stack.pop()!;
          const a = stack.pop()!;
          stack.push(operators[token](a, b));
        }
      });

      return stack[0];
    };

    const postfix = toPostfix(expression);
    return evaluatePostfix(postfix);
  };

  const renderButton = (value: string) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress(value)}
    >
      <Text style={styles.buttonText}>{value.trim()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.result}>{result || currentInput}</Text>
      <View style={styles.buttonRow}>
        {renderButton('1')}
        {renderButton('2')}
        {renderButton('3')}
        {renderButton('+')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('4')}
        {renderButton('5')}
        {renderButton('6')}
        {renderButton('-')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('7')}
        {renderButton('8')}
        {renderButton('9')}
        {renderButton('*')}
      </View>
      <View style={styles.buttonRow}>
        {renderButton('0')}
        {renderButton('/')}
        {renderButton('^')}
        <TouchableOpacity
          style={[styles.button, styles.equalsButton]}
          onPress={calculateResult}
        >
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearInput}
        >
          <Text style={styles.buttonText}>LIMPIAR</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.history}>
        {history.map((entry, index) => (
          <Text key={index} style={styles.historyEntry}>{entry}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  result: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
  },
  equalsButton: {
    flex: 2,
  },
  clearButton: {
    backgroundColor: '#32CD32', // Verde claro
    flex: 1,
  },
  history: {
    marginTop: 20,
    width: '100%',
  },
  historyEntry: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 2,
  },
});
