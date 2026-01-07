import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkSupersub from 'remark-supersub';
import remarkIns from 'remark-ins';
import remarkFlexibleMarkers from 'remark-flexible-markers'; // or remark-mark
import remarkDirective from 'remark-directive';
import remarkDefinitionList from 'remark-definition-list';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
}

import { visit } from 'unist-util-visit';

// Plugin to transform directives directly to hast data for ReactMarkdown to render
function remarkDirectiveRehype() {
    return (tree: any) => {
        visit(tree, ['containerDirective', 'leafDirective', 'textDirective'], (node) => {
            const data = node.data || (node.data = {});
            const tagName = node.type === 'textDirective' ? 'span' : 'div';

            if (node.name === 'warning') {
                data.hName = 'div';
                data.hProperties = { className: 'warning-box' };
            } else {
                data.hName = tagName;
                data.hProperties = node.attributes || {};
            }
        });
    };
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[
                remarkGfm,
                remarkEmoji,
                remarkSupersub,
                remarkIns,
                remarkFlexibleMarkers,
                remarkDefinitionList,
                remarkDirective,
                remarkDirectiveRehype
            ]}
            components={{
                code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            {...props}
                            style={dracula}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-xl overflow-hidden text-sm my-4"
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code {...props} className={`${className} bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono`}>
                            {children}
                        </code>
                    )
                },
                h1: ({ children }) => <h1 className="text-3xl font-bold text-slate-900 mt-8 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-bold text-slate-900 mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-bold text-slate-900 mt-5 mb-2">{children}</h3>,
                h4: ({ children }) => <h4 className="text-lg font-bold text-slate-900 mt-4 mb-2">{children}</h4>,
                p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-4 text-slate-700 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 text-slate-700 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
                del: ({ children }) => <del className="line-through text-slate-500">{children}</del>,
                strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
                em: ({ children }) => <em className="italic text-slate-800">{children}</em>,
                input: (props) => <input type="checkbox" className="mr-2 my-auto accent-primary-600 rounded border-slate-300" {...props} />,
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary-500 pl-4 py-1 italic text-slate-600 my-4 bg-slate-50 rounded-r-lg">
                        {children}
                    </blockquote>
                ),
                a: ({ children, href }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline decoration-primary-300 hover:decoration-primary-700 transition-colors">
                        {children}
                    </a>
                ),
                hr: () => <hr className="my-8 border-slate-200" />,
                table: ({ children }) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">{children}</table></div>,
                th: ({ children }) => <th className="px-4 py-2 bg-slate-50 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">{children}</th>,
                td: ({ children }) => <td className="px-4 py-2 whitespace-normal text-sm text-slate-700 border-b border-slate-200 leading-relaxed">{children}</td>,
                img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-xl shadow-md my-8 max-w-full h-auto mx-auto border border-slate-100" />,

                // Extended Markdown Elements
                mark: ({ children }) => <mark className="bg-yellow-200 text-slate-900 px-0.4 rounded">{children}</mark>,
                ins: ({ children }) => <ins className="no-underline bg-green-100 text-green-800 px-0.5 rounded border-b-2 border-green-300">{children}</ins>,
                sup: ({ children }) => <sup className="text-xs align-super text-slate-700">{children}</sup>,
                sub: ({ children }) => <sub className="text-xs align-baseline text-slate-700">{children}</sub>,
                dl: ({ children }) => <dl className="my-4 space-y-2">{children}</dl>,
                dt: ({ children }) => <dt className="font-bold text-slate-900 mt-2">{children}</dt>,
                dd: ({ children }) => <dd className="pl-4 border-l-2 border-slate-100 text-slate-700 italic">{children}</dd>,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
