"use client";

import { useCallback, useState } from "react";
import { array, object, string, type z } from "zod";

import { Alert, Button, Form, FormItem, Space, TagsInput } from "@meta-1/design";

// 表单 Schema
const getFormSchema = () =>
  object({
    tags: array(string()).min(1, "至少添加一个标签").max(5, "最多添加 5 个标签"),
    skills: array(string()).optional(),
    keywords: array(string()).optional(),
  });

type FormData = z.infer<ReturnType<typeof getFormSchema>>;

const Page = () => {
  const [tags1, setTags1] = useState<string[]>(["React", "Vue", "Angular"]);
  const [tags2, setTags2] = useState<string[]>([]);
  const [tags3, setTags3] = useState<string[]>([]);
  const [tags4, setTags4] = useState<string[]>([]);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  // Form 表单实例
  const form = Form.useForm<FormData>();

  const onSubmit = useCallback((data: FormData) => {
    console.log("提交的数据:", data);
    setSubmittedData(data);
  }, []);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="mb-4 font-bold text-2xl">TagsInput 组件示例</h1>
        <p className="text-muted-foreground">一个功能丰富的标签输入组件，支持添加、删除、验证等多种功能。</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">基础用法</h2>
        <p className="text-muted-foreground text-sm">按 Enter 或输入逗号添加标签，按 Backspace 删除最后一个标签。</p>
        <TagsInput onChange={setTags1} placeholder="输入标签后按 Enter..." value={tags1} />
        <div className="text-sm">当前标签：{tags1.length > 0 ? tags1.join(", ") : "无"}</div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">最大数量限制</h2>
        <p className="text-muted-foreground text-sm">最多只能添加 3 个标签</p>
        <TagsInput maxTags={3} onChange={setTags2} placeholder="最多 3 个标签..." value={tags2} />
        <Alert className="bg-secondary text-secondary-foreground" description={`已添加 ${tags2.length} / 3 个标签`} />
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">自定义验证</h2>
        <p className="text-muted-foreground text-sm">只允许添加字母和数字（不含特殊字符）</p>
        <TagsInput
          onChange={setTags3}
          placeholder="输入字母或数字..."
          validate={(tag) => /^[a-zA-Z0-9]+$/.test(tag)}
          value={tags3}
        />
        {tags3.length > 0 && <div className="text-sm">有效标签：{tags3.join(", ")}</div>}
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">禁用重复</h2>
        <p className="text-muted-foreground text-sm">不允许添加重复的标签</p>
        <TagsInput allowDuplicates={false} onChange={setTags4} placeholder="不允许重复标签..." value={tags4} />
        <div className="text-sm">唯一标签：{tags4.length > 0 ? tags4.join(", ") : "无"}</div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">禁用状态</h2>
        <TagsInput disabled placeholder="禁用状态..." value={["Disabled", "Tag"]} />
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">自定义样式</h2>
        <TagsInput
          className="border-primary"
          placeholder="自定义边框颜色..."
          tagClassName="bg-primary text-primary-foreground hover:bg-primary/90"
          value={["自定义", "样式"]}
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">事件回调</h2>
        <TagsInput
          onTagAdd={(tag) => console.log("添加标签:", tag)}
          onTagRemove={(tag) => console.log("删除标签:", tag)}
          placeholder="查看控制台日志..."
        />
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">操作示例</h2>
        <Space>
          <Button onClick={() => setTags1([])}>清空第一个</Button>
          <Button onClick={() => setTags1([...tags1, `标签${tags1.length + 1}`])}>添加到第一个</Button>
          <Button onClick={() => setTags1(["JavaScript", "TypeScript", "Python"])} variant="outline">
            重置第一个
          </Button>
        </Space>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-xl">在 Form 中使用</h2>
        <p className="text-muted-foreground text-sm">演示 TagsInput 在表单中的使用,包括验证、默认值和无默认值的情况</p>
        <Form<FormData>
          defaultValues={{
            tags: ["JavaScript", "TypeScript"],
            skills: [],
            // keywords 没有默认值,测试 undefined 情况
          }}
          form={form}
          onSubmit={onSubmit}
          schema={getFormSchema()}
        >
          <FormItem description="至少添加 1 个,最多 5 个标签" label="技术栈 (必填)" name="tags">
            <TagsInput maxTags={5} placeholder="输入技术栈标签..." />
          </FormItem>

          <FormItem description="添加您掌握的技能" label="技能标签 (可选)" name="skills">
            <TagsInput allowDuplicates={false} placeholder="输入技能标签..." />
          </FormItem>

          <FormItem description="没有默认值的字段测试" label="关键词 (可选)" name="keywords">
            <TagsInput placeholder="输入关键词..." />
          </FormItem>

          <Space>
            <Button onClick={() => form.submit()}>提交表单</Button>
            <Button
              onClick={() => {
                form.reset();
                setSubmittedData(null);
              }}
              variant="outline"
            >
              重置表单
            </Button>
          </Space>
        </Form>

        {submittedData && (
          <Alert
            className="bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
            description={
              <div className="space-y-2">
                <div>
                  <strong>技术栈:</strong> {submittedData.tags?.join(", ") || "无"}
                </div>
                <div>
                  <strong>技能:</strong> {submittedData.skills?.join(", ") || "无"}
                </div>
                <div>
                  <strong>关键词:</strong> {submittedData.keywords?.join(", ") || "无"}
                </div>
              </div>
            }
            title="表单提交成功!"
          />
        )}
      </div>
    </div>
  );
};

export default Page;
