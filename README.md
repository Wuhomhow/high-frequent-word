# high-frequent-word
# Zero-Leakage High-Frequency Vocabulary & Sentence System
# 零超纲高频英语词句系统（新高频单词排序与动态语境工程）

[[https://img.shields.io/badge/Vocabulary-54%2C005_Words-2563eb]](#1-项目简介)
[[https://img.shields.io/badge/Populated_Entries-1%E2%80%931%2C600-16a34a]](https://docs.google.com/spreadsheets/d/1SbZhS696NHm7aJspVCrBGpcRlZBKOPOZjzJjNEQasnQ/edit)
[[https://img.shields.io/badge/Framework-Zero--Leakage_%7C_Spiral_Reuse-d97706]](#2-核心设计理念与教学架构)
[[https://img.shields.io/badge/License-MIT-64748b.svg]](#7-开源协议)

> **在线实时词库预览（Google Sheets）**：[高频词句（实时更新主表）](https://docs.google.com/spreadsheets/d/1SbZhS696NHm7aJspVCrBGpcRlZBKOPOZjzJjNEQasnQ/edit)

## 1. 项目简介

**零超纲高频英语词句系统（Zero-Leakage High-Frequency Vocabulary & Sentence System）** 是一套基于 **54,005 词全量重排高频词表（《新高频单词排序表.xlsx》）** 构建的结构化英语词汇与语境习得开源工程。

传统词汇书与背单词软件普遍存在**“例句超纲死锁（Vocabulary Leakage Deadlock）”**痛点：当学习者背诵第 $N$ 个单词时，例句中往往充斥着尚未学到的低频生词（排位 $> N$），迫使学习者在理解目标词用法时频繁中断去查生词，造成严重的认知负荷超载（Cognitive Overload）。

本项目通过严格的**动态时序控制（Dynamic Timing Control）**、**零中文干扰视野（Zero-Chinese Target View）**、**不规则变形纯语法脚手架（Grammar-Only Inflection Scaffolding）**以及**跨词条旧句脱敏复现（Spiral Sentence Reuse & Bracket Stripping）**，为每个词条打造 3 条涵盖不同核心词义与高频搭配的零阅读障碍例句。

## 2. 核心设计理念与教学架构

* **严格动态时序（Strict Dynamic Timing, $1 \to N$）**：全局词表按语料库高频度与造句基础刚需进行线性重排（`1` 至 `54,005`）。在编纂第 $N$ 个目标词（$W_N$）的例句时，所有序号 $\le N$ 的单词均视为**已掌握词汇（Learned Vocabulary）**，优先使用 `1 ~ N` 已学词构建纯正语境。
* **目标词与已学词“零中文标注”铁律**：在 A 列例句阅读区中，**当前目标词 $W_N$（含其词性转换、规则派生及短语搭配）与全部已学词（$\le N$）严禁出现任何中文释义括号**；目标词的词性、常见中文释义与固定搭配全部独立收纳于 **B 列**，实现“左侧纯英文语境输入、右侧结构化词义锚定”的视野解耦。
* **不规则变形“纯语法提示”脚手架**：当序号 $\le N$ 的已学词（或当前目标词 $W_N$）在例句中以**不规则过去式、不规则过去分词、不规则复数或特殊比较级/最高级**形式出现时，括号内**仅标注纯语法溯源说明，绝不重复中文词义**（如 `wrote (write的过去式)`、`taken (take的过去分词)`、`children (child的复数)`、`leaves (leaf的复数)`、`better (good的比较级)`）。
* **未学词精准托底与括号密度控制**：若例句因语义自然度需要引入序号 $> N$ 的未学词（常用于向后序词条埋设前置预习锚点），必须紧跟 `(中文释义)` 标注（如 `storm (暴风雨)`），且单句括号总数严格限制在 **$\le 2 \sim 3$ 个**（理想状态为 $0 \sim 1$ 个）。
* **跨词条旧句联动与脱敏复现（Spiral Reuse & Bracket Stripping）**：当后序词 $W_M$（$M > N$）曾作为未学词出现在早期第 $N$ 词的例句中并带有 `W_M (中文)` 标注时，待学习推进至第 $M$ 词时，系统**直接原句复现该例句，并将 $W_M$ 原本的 `(中文)` 括号剥离**，形成“前置语境混脸熟 $\to$ 本位解锁去拐杖”的完整记忆闭环。

## 3. 编写与标注规范速查表

| 词汇类别 | 序号范围 | A 列例句标注规则 | 正向规范示例 | 严禁出现的错误示例 |
| :--- | :--- | :--- | :--- | :--- |
| **核心免标功能词** | 全局免标 | 完全不加任何括号 | `I, the, is, did, have, went, not...` | `went (go的过去式，去)` |
| **当前目标词 ($W_N$)** | $= N$ | **零中文括号**（不规则变形仅标纯语法） | `deny` / `denied (deny的过去式)` | `deny (否认)` / `denied (拒绝)` |
| **已学词原形与规则变形** | $< N$ | **零括号** | `workers` / `played` / `quickly` | `workers (工人)` |
| **已学词不规则变形** | $\le N$ | **仅标纯语法规则，不标中文** | `blew (blow的过去式)` / `teeth (tooth的复数)` | `blew (blow的过去式，吹)` |
| **未学超纲词 / 预埋词** | $> N$ | **必须标注 `(贴切中文释义)`** | `storm (暴风雨)` / `fruit (水果)` | 未加括号直接裸露超纲词 |

> **核心免标词集（Core Exempt Set）**：
> `I, me, my, mine, you, your, yours, he, him, his, she, her, hers, it, its, we, us, our, ours, they, them, their, theirs, a, an, the, this, that, these, those, be (am, is, are, was, were, been, being), do (does, did, done, doing), have (has, had, having), go (goes, went, gone, going), and, in, on, to, at, not, n't`

## 4. 数据结构与跨词条联动示例

词库主表（[高频词句](https://docs.google.com/spreadsheets/d/1SbZhS696NHm7aJspVCrBGpcRlZBKOPOZjzJjNEQasnQ/edit)）采用严格的行号映射（`Row N = Entry N`）与 A/B 双栏结构：

* **第 1358 词 `broad`（此时 `#1366. perspective` 与 `#1394. voter` 尚未学习，带中文括号预埋）**：
  * **A1358**：
```text
1358. broad/brɔːd/
(1) They walked down a broad street with tall green trees on both sides.
(2) The new plan has received broad support from local voters (选民).
(3) Travel gives young people a broad perspective (视角) on the world.
```
  * **B1358**：`adj. 宽阔的，广阔的；广泛的，概括的；开阔的`

* **推进至第 1366 词 `perspective`（正式解锁，直接复现 `#1358 (3)` 并剥离 `(视角)` 括号，同时预埋 `#1409. historical`）**：
  * **A1366**：
```text
1366. perspective/pərˈspektɪv/
(1) Travel gives young people a broad perspective on the world.
(2) Talking with people from different backgrounds helps us see things from a new perspective.
(3) We need to look at this economic problem from a historical (历史的) perspective.
```
  * **B1366**：`n. 视角，观点，看法；远景，透视法`

* **推进至第 1409 词 `historical`（正式解锁，同步复现 `#1366 (3)` 与 `#1376 (2)` 并剥离 `(历史的)` 括号）**：
  * **A1409**：
```text
1409. historical/hɪˈstɔːrɪkəl/
(1) We need to look at this economic problem from a historical perspective.
(2) It is important to understand this event in its historical context.
(3) The writer spent (spend的过去式) two years reading historical documents for her new book.
```
  * **B1409**：`adj. 历史的，历史上的，有关历史的`

## 5. 仓库目录结构

```text
.
├── README.md                      # 项目说明文档与编写规范
├── data/
│   ├── 新高频单词排序表.xlsx       # 54,005 词全局重排基准词表（方案 B）
│   ├── 高频词句.xlsx               # 双栏零超纲词句主库（离线归档版）
│   └── 高频词句.csv                # 供脚本与前端应用调用的 UTF-8 CSV 导出文件
└── scripts/
    ├── validate_zero_leakage.py   # 动态超纲率、已学词零中文与括号上限自动校验脚本
    └── export_sheets_sync.py      # 本地词库与在线表格同步辅助工具
```

## 6. 项目进度与路线图 (Roadmap)

- [x] **阶段一：54,005 词全局词频重排与基础刚需词底座构建（《新高频单词排序表.xlsx》）**
  - 完成基础代词、数词、星期、月份、四季、常见度量衡单位与高频核心词的前置整合。
- [x] **阶段二：前 1,600 核心高频词条全量编纂与合规清洗（`A1:B1600`）**
  - 完成 `1` 至 `1,600` 词的音标、4,800 条动态零超纲例句及 B 列词性释义同步，并全量通过“目标词/已学词零中文、不规则变形纯语法标注”规则审计。
- [ ] **阶段三：中高级高频核心词库推进（`1,601` – `5,000` 词）**
  - 持续以 25 词/批次推进高密度旧句复现与多义项全覆盖。
- [ ] **阶段四：全量词库建设与交互式学习前端集成（`5,001` – `54,005` 词）**
  - 对接单页 Web 词汇练习与自动化听写/阅读评测工具。

## 7. 开源协议

本项目采用 [MIT License](https://opensource.org/licenses/MIT) 开源协议。欢迎教育工作者、课程研发人员与开发者基于本词库开展二次开发与教学实践，引用时请保留原项目链接与出处说明。
