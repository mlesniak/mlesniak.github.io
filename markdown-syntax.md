<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
<head>
  <meta charset="utf-8" />
  <meta name="generator" content="pandoc" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <title>markdown-syntax</title>
  <style>
    code{white-space: pre-wrap;}
    span.smallcaps{font-variant: small-caps;}
    div.columns{display: flex; gap: min(4vw, 1.5em);}
    div.column{flex: auto; overflow-x: auto;}
    div.hanging-indent{margin-left: 1.5em; text-indent: -1.5em;}
    ul.task-list{list-style: none;}
    ul.task-list li input[type="checkbox"] {
      width: 0.8em;
      margin: 0 0.8em 0.2em -1.6em;
      vertical-align: middle;
    }
    .display.math{display: block; text-align: center; margin: 0.5rem auto;}
    /* CSS for syntax highlighting */
    pre > code.sourceCode { white-space: pre; position: relative; }
    pre > code.sourceCode > span { display: inline-block; line-height: 1.25; }
    pre > code.sourceCode > span:empty { height: 1.2em; }
    .sourceCode { overflow: visible; }
    code.sourceCode > span { color: inherit; text-decoration: inherit; }
    div.sourceCode { margin: 1em 0; }
    pre.sourceCode { margin: 0; }
    @media screen {
    div.sourceCode { overflow: auto; }
    }
    @media print {
    pre > code.sourceCode { white-space: pre-wrap; }
    pre > code.sourceCode > span { text-indent: -5em; padding-left: 5em; }
    }
    pre.numberSource code
      { counter-reset: source-line 0; }
    pre.numberSource code > span
      { position: relative; left: -4em; counter-increment: source-line; }
    pre.numberSource code > span > a:first-child::before
      { content: counter(source-line);
        position: relative; left: -1em; text-align: right; vertical-align: baseline;
        border: none; display: inline-block;
        -webkit-touch-callout: none; -webkit-user-select: none;
        -khtml-user-select: none; -moz-user-select: none;
        -ms-user-select: none; user-select: none;
        padding: 0 4px; width: 4em;
        color: #aaaaaa;
      }
    pre.numberSource { margin-left: 3em; border-left: 1px solid #aaaaaa;  padding-left: 4px; }
    div.sourceCode
      {   }
    @media screen {
    pre > code.sourceCode > span > a:first-child::before { text-decoration: underline; }
    }
    code span.al { color: #ff0000; font-weight: bold; } /* Alert */
    code span.an { color: #60a0b0; font-weight: bold; font-style: italic; } /* Annotation */
    code span.at { color: #7d9029; } /* Attribute */
    code span.bn { color: #40a070; } /* BaseN */
    code span.bu { color: #008000; } /* BuiltIn */
    code span.cf { color: #007020; font-weight: bold; } /* ControlFlow */
    code span.ch { color: #4070a0; } /* Char */
    code span.cn { color: #880000; } /* Constant */
    code span.co { color: #60a0b0; font-style: italic; } /* Comment */
    code span.cv { color: #60a0b0; font-weight: bold; font-style: italic; } /* CommentVar */
    code span.do { color: #ba2121; font-style: italic; } /* Documentation */
    code span.dt { color: #902000; } /* DataType */
    code span.dv { color: #40a070; } /* DecVal */
    code span.er { color: #ff0000; font-weight: bold; } /* Error */
    code span.ex { } /* Extension */
    code span.fl { color: #40a070; } /* Float */
    code span.fu { color: #06287e; } /* Function */
    code span.im { color: #008000; font-weight: bold; } /* Import */
    code span.in { color: #60a0b0; font-weight: bold; font-style: italic; } /* Information */
    code span.kw { color: #007020; font-weight: bold; } /* Keyword */
    code span.op { color: #666666; } /* Operator */
    code span.ot { color: #007020; } /* Other */
    code span.pp { color: #bc7a00; } /* Preprocessor */
    code span.sc { color: #4070a0; } /* SpecialChar */
    code span.ss { color: #bb6688; } /* SpecialString */
    code span.st { color: #4070a0; } /* String */
    code span.va { color: #19177c; } /* Variable */
    code span.vs { color: #4070a0; } /* VerbatimString */
    code span.wa { color: #60a0b0; font-weight: bold; font-style: italic; } /* Warning */
  </style>
  <link rel="stylesheet" href="pandoc.css" />
  <!--[if lt IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.min.js"></script>
  <![endif]-->
</head>
<body>
<p>+++ title = “Markdown Syntax Guide” date = “2020-01-03” description =
“Sample article showcasing basic Markdown syntax and formatting for HTML
elements.” tags = [ “markdown”, “syntax”,] +++</p>
<p>For a quick cheatsheet, check out
https://simplemde.com/markdown-guide.</p>
<hr />
<p>This article offers a sample of basic Markdown syntax that can be
used in Hugo content files, also it shows whether basic HTML elements
are decorated with CSS in a Hugo theme. <!--more--></p>
<h2 id="headings">Headings</h2>
<p>The following HTML <code>&lt;h1&gt;</code>—<code>&lt;h6&gt;</code>
elements represent six levels of section headings.
<code>&lt;h1&gt;</code> is the highest section level while
<code>&lt;h6&gt;</code> is the lowest.</p>
<h1 id="h1">H1</h1>
<h2 id="h2">H2</h2>
<h3 id="h3">H3</h3>
<h4 id="h4">H4</h4>
<h5 id="h5">H5</h5>
<h6 id="h6">H6</h6>
<h2 id="paragraph">Paragraph</h2>
<p>Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda
cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui
voluptate ma dolestendit peritin re plis aut quas inctum laceat est
volestemque commosa as cus endigna tectur, offic to cor sequas etum
rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust
voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea
corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin
conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et
facea ipsamus es exerum sitate dolores editium rerore eost, temped
molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia
prat.</p>
<p>Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ
idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex
eat.</p>
<h2 id="blockquotes">Blockquotes</h2>
<p>The blockquote element represents content that is quoted from another
source, optionally with a citation which must be within a
<code>footer</code> or <code>cite</code> element, and optionally with
in-line changes such as annotations and abbreviations.</p>
<h4 id="blockquote-without-attribution">Blockquote without
attribution</h4>
<blockquote>
<p>Tiam, ad mint andaepu dandae nostion secatur sequo quae.
<strong>Note</strong> that you can use <em>Markdown syntax</em> within a
blockquote.</p>
</blockquote>
<h4 id="blockquote-with-attribution">Blockquote with attribution</h4>
<blockquote>
<p>Don’t communicate by sharing memory, share memory by
communicating.<br> — <cite>Rob Pike<a href="#fn1" class="footnote-ref"
id="fnref1" role="doc-noteref"><sup>1</sup></a></cite></p>
</blockquote>
<h2 id="tables">Tables</h2>
<p>Tables aren’t part of the core Markdown spec, but Hugo supports
supports them out-of-the-box.</p>
<table>
<thead>
<tr class="header">
<th>Name</th>
<th>Age</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Bob</td>
<td>27</td>
</tr>
<tr class="even">
<td>Alice</td>
<td>23</td>
</tr>
</tbody>
</table>
<h4 id="inline-markdown-within-tables">Inline Markdown within
tables</h4>
<table>
<thead>
<tr class="header">
<th>Italics</th>
<th>Bold</th>
<th>Code</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><em>italics</em></td>
<td><strong>bold</strong></td>
<td><code>code</code></td>
</tr>
</tbody>
</table>
<h2 id="code-blocks">Code Blocks</h2>
<h4 id="code-block-with-backticks">Code block with backticks</h4>
<div class="sourceCode" id="cb1"><pre
class="sourceCode html"><code class="sourceCode html"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a><span class="dt">&lt;!doctype </span>html<span class="dt">&gt;</span></span>
<span id="cb1-2"><a href="#cb1-2" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;html</span> <span class="er">lang</span><span class="ot">=</span><span class="st">&quot;en&quot;</span><span class="kw">&gt;</span></span>
<span id="cb1-3"><a href="#cb1-3" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;head&gt;</span></span>
<span id="cb1-4"><a href="#cb1-4" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;meta</span> <span class="er">charset</span><span class="ot">=</span><span class="st">&quot;utf-8&quot;</span><span class="kw">&gt;</span></span>
<span id="cb1-5"><a href="#cb1-5" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;title&gt;</span>Example HTML5 Document<span class="kw">&lt;/title&gt;</span></span>
<span id="cb1-6"><a href="#cb1-6" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;/head&gt;</span></span>
<span id="cb1-7"><a href="#cb1-7" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;body&gt;</span></span>
<span id="cb1-8"><a href="#cb1-8" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;p&gt;</span>Test<span class="kw">&lt;/p&gt;</span></span>
<span id="cb1-9"><a href="#cb1-9" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;/body&gt;</span></span>
<span id="cb1-10"><a href="#cb1-10" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;/html&gt;</span></span></code></pre></div>
<h4 id="code-block-indented-with-four-spaces">Code block indented with
four spaces</h4>
<pre><code>&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;title&gt;Example HTML5 Document&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;p&gt;Test&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<h4 id="code-block-with-hugos-internal-highlight-shortcode">Code block
with Hugo’s internal highlight shortcode</h4>
{{&lt; highlight html &gt;}} &lt;!doctype html&gt;
<html lang="en">
<head>
<meta charset="utf-8">
<title>
Example HTML5 Document
</title>
</head>
<body>
<p>
Test
</p>
</body>
</html>
<p>{{&lt; /highlight &gt;}}</p>
<h2 id="list-types">List Types</h2>
<h4 id="ordered-list">Ordered List</h4>
<ol type="1">
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ol>
<h4 id="unordered-list">Unordered List</h4>
<ul>
<li>List item</li>
<li>Another item</li>
<li>And another item</li>
</ul>
<h4 id="nested-list">Nested list</h4>
<ul>
<li>Fruit
<ul>
<li>Apple</li>
<li>Orange</li>
<li>Banana</li>
</ul></li>
<li>Dairy
<ul>
<li>Milk</li>
<li>Cheese</li>
</ul></li>
</ul>
<h2 id="other-elements-abbr-sub-sup-kbd-mark">Other Elements — abbr,
sub, sup, kbd, mark</h2>
<p><abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap
image format.</p>
<p>H<sub>2</sub>O</p>
<p>X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup></p>
<p>Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to
end the session.</p>
<p>Most <mark>salamanders</mark> are nocturnal, and hunt for insects,
worms, and other small creatures.</p>
<aside id="footnotes" class="footnotes footnotes-end-of-document"
role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><p>The above quote is excerpted from Rob Pike’s <a
href="https://www.youtube.com/watch?v=PAAkCSZUG1c">talk</a> during
Gopherfest, November 18, 2015.<a href="#fnref1" class="footnote-back"
role="doc-backlink">↩︎</a></p></li>
</ol>
</aside>
</body>
</html>