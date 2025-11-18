"use client";

import { useCallback, useMemo, useState } from "react";
import { debounce } from "lodash";

import { ComboSelect } from "@meta-1/design";
import type { ComboSelectValueType } from "@meta-1/design";

const Page = () => {
  // 基础单选 - string 类型
  const [singleValue, setSingleValue] = useState<string>("apple");

  // 基础多选 - string 类型
  const [multiValue, setMultiValue] = useState<string[]>(["react", "vue"]);

  // 单选 - number 类型
  const [numberValue, setNumberValue] = useState<number>(1);

  // 多选 - number 类型
  const [multiNumberValue, setMultiNumberValue] = useState<number[]>([101, 102]);

  // 带搜索的多选
  // biome-ignore lint/suspicious/noExplicitAny: <result>
  const [searchResult, setSearchResult] = useState<any[]>([
    { label: "北京", value: 1001 },
    { label: "上海", value: 1002 },
    { label: "广州", value: 1003 },
    { label: "深圳", value: 1004 },
  ]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<number[]>([1001, 1002]);

  // 限制选择数量
  const [limitValue, setLimitValue] = useState<string[]>(["tag1"]);

  // 可清空的单选
  const [clearableValue, setClearableValue] = useState<string>("option1");

  const onSearch = useCallback(
    debounce(async (value: string) => {
      console.log("搜索:", value);
      // 模拟 API 请求
      setSearchLoading(true);
      setTimeout(() => {
        const allCities = [
          { label: "北京", value: 1001 },
          { label: "上海", value: 1002 },
          { label: "广州", value: 1003 },
          { label: "深圳", value: 1004 },
          { label: "杭州", value: 1005 },
          { label: "成都", value: 1006 },
          { label: "武汉", value: 1007 },
          { label: "西安", value: 1008 },
        ];
        const filtered = value
          ? allCities.filter((city) => city.label.includes(value))
          : allCities;
        setSearchResult(filtered);
        setSearchLoading(false);
      }, 500);
    }, 500),
    [],
  );

  const fruitOptions = useMemo(
    () => [
      { value: "apple", label: "🍎 苹果" },
      { value: "banana", label: "🍌 香蕉" },
      { value: "orange", label: "🍊 橙子" },
      { value: "grape", label: "🍇 葡萄" },
      { value: "watermelon", label: "🍉 西瓜" },
    ],
    [],
  );

  const frameworkOptions = useMemo(
    () => [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "solid", label: "Solid" },
    ],
    [],
  );

  const numberOptions = useMemo(
    () => [
      { value: 1, label: "选项 1" },
      { value: 2, label: "选项 2" },
      { value: 3, label: "选项 3" },
      { value: 4, label: "选项 4" },
      { value: 5, label: "选项 5" },
    ],
    [],
  );

  const multiNumberOptions = useMemo(
    () => [
      { value: 101, label: "产品 101" },
      { value: 102, label: "产品 102" },
      { value: 103, label: "产品 103" },
      { value: 104, label: "产品 104" },
      { value: 105, label: "产品 105" },
    ],
    [],
  );

  const tagOptions = useMemo(
    () => [
      { value: "tag1", label: "标签1" },
      { value: "tag2", label: "标签2" },
      { value: "tag3", label: "标签3" },
      { value: "tag4", label: "标签4" },
      { value: "tag5", label: "标签5" },
    ],
    [],
  );

  const clearableOptions = useMemo(
    () => [
      { value: "option1", label: "选项 1" },
      { value: "option2", label: "选项 2" },
      { value: "option3", label: "选项 3" },
    ],
    [],
  );

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="mb-4 text-2xl font-bold">ComboSelect 组件演示</h1>
        <p className="text-muted-foreground">支持单选、多选、搜索、数字类型等多种场景</p>
      </div>

      {/* 基础单选 - string 类型 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">1. 基础单选 (String 类型)</h3>
        <ComboSelect
          className="w-[280px]"
          onChange={(val) => {
            console.log("单选值:", val);
            setSingleValue(val as string);
          }}
          options={fruitOptions}
          placeholder="请选择水果"
          value={singleValue}
        />
        <p className="text-muted-foreground text-sm">
          当前选择: <code className="rounded bg-muted px-2 py-1">{singleValue}</code>
        </p>
      </div>

      {/* 基础多选 - string 类型 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">2. 基础多选 (String 类型)</h3>
        <ComboSelect
          className="w-[280px]"
          multiple
          onChange={(val) => {
            console.log("多选值:", val);
            setMultiValue(val as string[]);
          }}
          options={frameworkOptions}
          placeholder="请选择框架"
          value={multiValue}
        />
        <p className="text-muted-foreground text-sm">
          当前选择: <code className="rounded bg-muted px-2 py-1">{JSON.stringify(multiValue)}</code>
        </p>
      </div>

      {/* 单选 - number 类型 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">3. 单选 (Number 类型)</h3>
        <ComboSelect
          className="w-[280px]"
          onChange={(val) => {
            console.log("数字单选值:", val, typeof val);
            setNumberValue(val as number);
          }}
          options={numberOptions}
          placeholder="请选择选项"
          value={numberValue}
        />
        <p className="text-muted-foreground text-sm">
          当前选择: <code className="rounded bg-muted px-2 py-1">{numberValue}</code>{" "}
          <span className="text-xs">(类型: {typeof numberValue})</span>
        </p>
      </div>

      {/* 多选 - number 类型 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">4. 多选 (Number 类型)</h3>
        <ComboSelect
          className="w-[280px]"
          multiple
          onChange={(val) => {
            console.log("数字多选值:", val);
            setMultiNumberValue(val as number[]);
          }}
          options={multiNumberOptions}
          placeholder="请选择产品"
          value={multiNumberValue}
        />
        <p className="text-muted-foreground text-sm">
          当前选择: <code className="rounded bg-muted px-2 py-1">{JSON.stringify(multiNumberValue)}</code>
        </p>
      </div>

      {/* 带搜索的多选 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">5. 带搜索的多选</h3>
        <ComboSelect<{ label: string; value: number }>
          className="w-[280px]"
          filter={(value, search, option) => {
            return (option?.label as string)?.includes(search) || value.includes(search);
          }}
          loading={searchLoading}
          multiple
          onChange={(val) => {
            console.log("搜索多选值:", val);
            setSearchValue(val as number[]);
          }}
          onSearch={(value) => {
            onSearch(value);
          }}
          options={searchResult}
          placeholder="搜索城市"
          search
          searchPlaceholder="输入城市名称..."
          value={searchValue}
        />
        <p className="text-muted-foreground text-sm">
          当前选择: <code className="rounded bg-muted px-2 py-1">{JSON.stringify(searchValue)}</code>
        </p>
      </div>

      {/* 限制选择数量 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">6. 限制选择数量 (最多 3 个)</h3>
        <ComboSelect
          className="w-[280px]"
          limit={3}
          multiple
          onChange={(val) => {
            console.log("限制数量值:", val);
            setLimitValue(val as string[]);
          }}
          options={tagOptions}
          placeholder="最多选择 3 个标签"
          value={limitValue}
        />
        <p className="text-muted-foreground text-sm">
          已选择: {limitValue.length} / 3{" "}
          <code className="rounded bg-muted px-2 py-1">{JSON.stringify(limitValue)}</code>
        </p>
      </div>

      {/* 可清空的单选 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">7. 可清空的单选</h3>
        <ComboSelect
          className="w-[280px]"
          clearable
          onChange={(val) => {
            console.log("可清空值:", val);
            setClearableValue(val as string);
          }}
          options={clearableOptions}
          placeholder="可清空选择"
          value={clearableValue}
        />
        <p className="text-muted-foreground text-sm">
          当前选择: <code className="rounded bg-muted px-2 py-1">{clearableValue || "(未选择)"}</code>
        </p>
      </div>

      {/* 禁用清空的多选 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">8. 禁用清空的多选</h3>
        <ComboSelect
          className="w-[280px]"
          clearable={false}
          multiple
          onChange={(val) => {
            console.log("禁用清空值:", val);
          }}
          options={frameworkOptions}
          placeholder="无法清空"
          value={["react"]}
        />
        <p className="text-muted-foreground text-sm">该选择器无清空按钮</p>
      </div>

      {/* 空选项 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">9. 空选项展示</h3>
        <ComboSelect
          className="w-[280px]"
          empty={<div className="p-4 text-center text-muted-foreground">暂无数据</div>}
          onChange={(val) => {
            console.log("空选项值:", val);
          }}
          options={[]}
          placeholder="空选项"
        />
        <p className="text-muted-foreground text-sm">当 options 为空时显示自定义内容</p>
      </div>
    </div>
  );
};

export default Page;
