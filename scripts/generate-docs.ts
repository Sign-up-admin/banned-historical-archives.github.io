/**
 * @fileoverview 文档自动生成脚本
 *
 * 从代码注释（JSDoc/TSDoc）自动生成项目文档，包括：
 * - API 文档（从 utils/index.ts）
 * - 类型文档（从 types/index.ts）
 * - 构建脚本文档（从 backend/*.ts）
 */

import { readFileSync, writeFileSync, ensureDirSync, readdirSync } from 'fs-extra';
import { join, basename, relative } from 'path';
import * as ts from 'typescript';

interface FunctionDoc {
  name: string;
  description: string;
  params: Array<{ name: string; type?: string; description: string }>;
  returns?: { type?: string; description: string };
  examples: string[];
}

interface TypeDoc {
  name: string;
  description: string;
  properties: Array<{ name: string; type: string; description: string; optional: boolean }>;
}

interface ScriptDoc {
  name: string;
  description: string;
  processSteps: string[];
  examples: string[];
  filePath: string;
}

/**
 * 从注释文本中提取描述和标签
 */
function extractCommentInfo(commentText: string): {
  description: string;
  params: Array<{ name: string; type?: string; description: string }>;
  returns?: { type?: string; description: string };
  examples: string[];
} {
  const description: string[] = [];
  const params: Array<{ name: string; type?: string; description: string }> = [];
  let returns: { type?: string; description: string } | undefined;
  const examples: string[] = [];

  const lines = commentText.split('\n');
  let currentSection: 'description' | 'param' | 'returns' | 'example' | null = 'description';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 跳过注释标记
    if (line.startsWith('/**') || line.startsWith('*') || line.startsWith('*/')) {
      continue;
    }

    // 检测标签
    if (line.startsWith('@param')) {
      currentSection = 'param';
      const match = line.match(/@param\s+(\w+)\s*(?:-\s*)?(.*)/);
      if (match) {
        params.push({
          name: match[1],
          description: match[2] || '',
        });
      }
    } else if (line.startsWith('@returns') || line.startsWith('@return')) {
      currentSection = 'returns';
      const match = line.match(/@returns?\s*(?:-\s*)?(.*)/);
      if (match) {
        returns = { description: match[1] || '' };
      }
    } else if (line.startsWith('@example')) {
      currentSection = 'example';
      const match = line.match(/@example\s*(.*)/);
      if (match) {
        examples.push(match[1]);
      }
    } else if (line.startsWith('@')) {
      currentSection = null;
    } else if (line && currentSection === 'description') {
      description.push(line);
    } else if (line && currentSection === 'param' && params.length > 0) {
      params[params.length - 1].description += ' ' + line;
    } else if (line && currentSection === 'returns' && returns) {
      returns.description += ' ' + line;
    } else if (line && currentSection === 'example' && examples.length > 0) {
      examples[examples.length - 1] += '\n' + line;
    }
  }

  // 提取代码块示例
  const codeBlockMatches = commentText.match(/```[\s\S]*?```/g);
  if (codeBlockMatches) {
    examples.push(...codeBlockMatches);
  }

  return {
    description: description.join('\n').trim(),
    params,
    returns,
    examples,
  };
}

/**
 * 从 TypeScript 文件提取函数文档
 */
function extractFunctionDocs(filePath: string): FunctionDoc[] {
  const sourceCode = readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  const functions: FunctionDoc[] = [];

  function visit(node: ts.Node) {
    // 只处理导出的函数声明
    if (ts.isFunctionDeclaration(node) && node.name) {
      // 检查是否有JSDoc注释
      const commentText = node.getFullText(sourceFile);
      const commentMatch = commentText.match(/\/\*\*[\s\S]*?\*\//);
      if (commentMatch) {
          const info = extractCommentInfo(commentMatch[0]);

          // 提取参数类型
          if (node.parameters) {
            for (let i = 0; i < node.parameters.length; i++) {
              const param = node.parameters[i];
              const paramName = param.name && ts.isIdentifier(param.name) ? param.name.text : '';
              const paramType = param.type ? param.type.getText(sourceFile) : undefined;
              
              if (info.params[i]) {
                info.params[i].type = paramType;
              } else if (paramName) {
                info.params.push({
                  name: paramName,
                  type: paramType,
                  description: '',
                });
              }
            }
          }

          // 提取返回类型
          if (node.type && !info.returns) {
            info.returns = {
              type: node.type.getText(sourceFile),
              description: '',
            };
          }

          functions.push({
            name: node.name.text,
            description: info.description,
            params: info.params,
            returns: info.returns,
            examples: info.examples,
          });
        }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return functions;
}

/**
 * 从 TypeScript 文件提取类型文档
 */
function extractTypeDocs(filePath: string): TypeDoc[] {
  const sourceCode = readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  const types: TypeDoc[] = [];

  function visit(node: ts.Node) {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      const commentText = node.getFullText(sourceFile);
      const commentMatch = commentText.match(/\/\*\*[\s\S]*?\*\//);
      const info = commentMatch ? extractCommentInfo(commentMatch[0]) : { description: '', params: [], examples: [] };

      const properties: Array<{ name: string; type: string; description: string; optional: boolean }> = [];

      if (ts.isTypeAliasDeclaration(node) && node.type && ts.isTypeLiteralNode(node.type)) {
        for (const member of node.type.members) {
          if (ts.isPropertySignature(member)) {
            const propName = member.name && ts.isIdentifier(member.name) ? member.name.text : '';
            const propType = member.type ? member.type.getText(sourceFile) : 'any';
            const optional = member.questionToken !== undefined;
            properties.push({
              name: propName,
              type: propType,
              description: '',
              optional,
            });
          }
        }
      } else if (ts.isInterfaceDeclaration(node)) {
        for (const member of node.members) {
          if (ts.isPropertySignature(member)) {
            const propName = member.name && ts.isIdentifier(member.name) ? member.name.text : '';
            const propType = member.type ? member.type.getText(sourceFile) : 'any';
            const optional = member.questionToken !== undefined;
            
            // 尝试从注释中提取属性描述
            const memberComment = member.getFullText(sourceFile);
            const memberCommentMatch = memberComment.match(/\/\*\*[\s\S]*?\*\//);
            const memberInfo = memberCommentMatch ? extractCommentInfo(memberCommentMatch[0]) : null;

            properties.push({
              name: propName,
              type: propType,
              description: memberInfo?.description || '',
              optional,
            });
          }
        }
      }

      types.push({
        name,
        description: info.description,
        properties,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return types;
}

/**
 * 从构建脚本提取文档
 */
function extractScriptDocs(filePath: string): ScriptDoc | null {
  const sourceCode = readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
  );

  // 查找文件级别的JSDoc注释
  const fileComment = sourceFile.getFullText().match(/\/\*\*[\s\S]*?\*\//);
  if (!fileComment) return null;

  const info = extractCommentInfo(fileComment[0]);
  const processSteps: string[] = [];

  // 从注释中提取处理流程（以数字开头的列表项）
  const processMatches = fileComment[0].match(/\d+\.\s+([^\n]+)/g);
  if (processMatches) {
    processSteps.push(...processMatches.map((m) => m.replace(/^\d+\.\s+/, '').trim()));
  }

  return {
    name: basename(filePath, '.ts'),
    description: info.description,
    processSteps,
    examples: info.examples,
    filePath: relative(process.cwd(), filePath).replace(/\\/g, '/'),
  };
}

/**
 * 生成 API 文档
 */
function generateAPIDocs(): string {
  const utilsPath = join(process.cwd(), 'utils', 'index.ts');
  const functions = extractFunctionDocs(utilsPath);

  let markdown = `# API 文档（自动生成） / API Documentation (Auto-generated)

> ⚠️ **注意**: 本文档由脚本自动生成，请勿手动编辑。如需更新，请修改 \`utils/index.ts\` 中的代码注释。
>
> ⚠️ **Note**: This document is auto-generated. Please update code comments in \`utils/index.ts\` instead of editing this file directly.

**最后生成时间 / Last Generated**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

## 概述 / Overview

本文档包含项目中所有工具函数的 API 说明，这些函数定义在 \`utils/index.ts\` 中。

This document contains API documentation for all utility functions defined in \`utils/index.ts\`.

## 函数列表 / Function List

`;

  for (const func of functions) {
    markdown += `### ${func.name}\n\n`;
    if (func.description) {
      markdown += `${func.description}\n\n`;
    }

    if (func.params.length > 0) {
      markdown += `**参数 / Parameters:**\n\n`;
      markdown += `| 参数名 / Name | 类型 / Type | 说明 / Description |\n`;
      markdown += `|--------------|------------|-------------------|\n`;
      for (const param of func.params) {
        markdown += `| \`${param.name}\` | ${param.type || 'any'} | ${param.description || ''} |\n`;
      }
      markdown += `\n`;
    }

    if (func.returns) {
      markdown += `**返回值 / Returns:**\n\n`;
      markdown += `- **类型 / Type**: \`${func.returns.type || 'any'}\`\n`;
      if (func.returns.description) {
        markdown += `- **说明 / Description**: ${func.returns.description}\n`;
      }
      markdown += `\n`;
    }

    if (func.examples.length > 0) {
      markdown += `**示例 / Examples:**\n\n`;
      for (const example of func.examples) {
        markdown += `${example}\n\n`;
      }
    }

    markdown += `---\n\n`;
  }

  return markdown;
}

/**
 * 生成类型文档
 */
function generateTypesDocs(): string {
  const typesPath = join(process.cwd(), 'types', 'index.ts');
  const types = extractTypeDocs(typesPath);

  let markdown = `# 类型定义文档（自动生成） / Type Definitions Documentation (Auto-generated)

> ⚠️ **注意**: 本文档由脚本自动生成，请勿手动编辑。如需更新，请修改 \`types/index.ts\` 中的代码注释。
>
> ⚠️ **Note**: This document is auto-generated. Please update code comments in \`types/index.ts\` instead of editing this file directly.

**最后生成时间 / Last Generated**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

## 概述 / Overview

本文档包含项目中所有 TypeScript 类型定义的说明，这些类型定义在 \`types/index.ts\` 中。

This document contains documentation for all TypeScript type definitions in \`types/index.ts\`.

## 类型列表 / Type List

`;

  for (const type of types) {
    markdown += `### ${type.name}\n\n`;
    if (type.description) {
      markdown += `${type.description}\n\n`;
    }

    if (type.properties.length > 0) {
      markdown += `**属性 / Properties:**\n\n`;
      markdown += `| 属性名 / Name | 类型 / Type | 可选 / Optional | 说明 / Description |\n`;
      markdown += `|--------------|------------|----------------|-------------------|\n`;
      for (const prop of type.properties) {
        markdown += `| \`${prop.name}\` | \`${prop.type}\` | ${prop.optional ? '是 / Yes' : '否 / No'} | ${prop.description || ''} |\n`;
      }
      markdown += `\n`;
    }

    markdown += `---\n\n`;
  }

  return markdown;
}

/**
 * 生成构建脚本文档
 */
function generateBuildScriptsDocs(): string {
  const backendDir = join(process.cwd(), 'backend');
  const files = readdirSync(backendDir)
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
    .map((file) => join(backendDir, file));

  const scripts: ScriptDoc[] = [];
  for (const file of files) {
    const doc = extractScriptDocs(file);
    if (doc) {
      scripts.push(doc);
    }
  }

  let markdown = `# 构建脚本文档（自动生成） / Build Scripts Documentation (Auto-generated)

> ⚠️ **注意**: 本文档由脚本自动生成，请勿手动编辑。如需更新，请修改 \`backend/*.ts\` 中的代码注释。
>
> ⚠️ **Note**: This document is auto-generated. Please update code comments in \`backend/*.ts\` instead of editing this file directly.

**最后生成时间 / Last Generated**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

## 概述 / Overview

本文档包含所有构建脚本的说明，这些脚本位于 \`backend/\` 目录中。

This document contains documentation for all build scripts in the \`backend/\` directory.

## 脚本列表 / Script List

`;

  for (const script of scripts) {
    markdown += `### ${script.name}\n\n`;
    markdown += `**文件路径 / File Path**: \`${script.filePath}\`\n\n`;

    if (script.description) {
      markdown += `${script.description}\n\n`;
    }

    if (script.processSteps.length > 0) {
      markdown += `**处理流程 / Process:**\n\n`;
      for (let i = 0; i < script.processSteps.length; i++) {
        markdown += `${i + 1}. ${script.processSteps[i]}\n`;
      }
      markdown += `\n`;
    }

    if (script.examples.length > 0) {
      markdown += `**使用示例 / Examples:**\n\n`;
      for (const example of script.examples) {
        markdown += `${example}\n\n`;
      }
    }

    markdown += `---\n\n`;
  }

  return markdown;
}

/**
 * 主函数
 */
async function main() {
  console.log('开始生成文档...');

  const docsDir = join(process.cwd(), 'docs');
  ensureDirSync(docsDir);

  // 生成 API 文档
  console.log('生成 API 文档...');
  try {
    const apiDocs = generateAPIDocs();
    writeFileSync(join(docsDir, 'API_GENERATED.md'), apiDocs, 'utf-8');
    console.log('✓ API 文档已生成');
  } catch (error) {
    console.error('生成 API 文档失败:', error);
  }

  // 生成类型文档
  console.log('生成类型文档...');
  try {
    const typesDocs = generateTypesDocs();
    writeFileSync(join(docsDir, 'TYPES_GENERATED.md'), typesDocs, 'utf-8');
    console.log('✓ 类型文档已生成');
  } catch (error) {
    console.error('生成类型文档失败:', error);
  }

  // 生成构建脚本文档
  console.log('生成构建脚本文档...');
  try {
    const scriptsDocs = generateBuildScriptsDocs();
    writeFileSync(join(docsDir, 'BUILD_SCRIPTS_GENERATED.md'), scriptsDocs, 'utf-8');
    console.log('✓ 构建脚本文档已生成');
  } catch (error) {
    console.error('生成构建脚本文档失败:', error);
  }

  console.log('\n文档生成完成！');
  console.log('生成的文件：');
  console.log('  - docs/API_GENERATED.md');
  console.log('  - docs/TYPES_GENERATED.md');
  console.log('  - docs/BUILD_SCRIPTS_GENERATED.md');
}

main().catch((error) => {
  console.error('生成文档时出错:', error);
  process.exit(1);
});
