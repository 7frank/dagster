import {Colors} from '@dagster-io/ui-components';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize';
import gfm from 'remark-gfm';
import {createGlobalStyle} from 'styled-components';
import 'highlight.js/styles/github.css';



/**
 * Feature flag to enable extended HTML support in markdown rendering.
 * When enabled, adds support for:
 * - Multimedia elements: audio, video, img, source tags with controls and styling
 * - Table elements: table, thead, tbody, tr, th, td with border and style attributes
 * - Additional protocols: data URLs, http, and https for media sources
 * - Raw HTML processing via rehype-raw plugin
 */
const extended = true;

const extendedProtocols = ['data', 'http', 'https'];
const extendedAttributes = {
  audio: ['src', 'controls'],
  video: ['src', 'controls'],
  img: ['src', 'alt'],
  source: ['src', 'type'],
  table: ['border', 'style'],
  thead: [],
  tbody: [],
  tr: [],
  th: ['style'],
  td: ['style'],
};

const sanitizeConfig = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), ...(extended ? Object.getOwnPropertyNames(extendedAttributes) : [])],
  protocols: {
    ...defaultSchema.protocols,
    src: [...(defaultSchema.protocols?.src || []), ...(extended ? extendedProtocols : [])],
  },
  attributes: {
    ...defaultSchema.attributes,
    ...(extended ? extendedAttributes : {}),
    span: [
      ...(defaultSchema.attributes?.span || []),
      // List of all allowed tokens:
      [
        'className',
        'hljs-addition',
        'hljs-attr',
        'hljs-attribute',
        'hljs-built_in',
        'hljs-bullet',
        'hljs-char',
        'hljs-code',
        'hljs-comment',
        'hljs-deletion',
        'hljs-doctag',
        'hljs-emphasis',
        'hljs-formula',
        'hljs-keyword',
        'hljs-link',
        'hljs-literal',
        'hljs-meta',
        'hljs-name',
        'hljs-number',
        'hljs-operator',
        'hljs-params',
        'hljs-property',
        'hljs-punctuation',
        'hljs-quote',
        'hljs-regexp',
        'hljs-section',
        'hljs-selector-attr',
        'hljs-selector-class',
        'hljs-selector-id',
        'hljs-selector-pseudo',
        'hljs-selector-tag',
        'hljs-string',
        'hljs-strong',
        'hljs-subst',
        'hljs-symbol',
        'hljs-tag',
        'hljs-template-tag',
        'hljs-template-variable',
        'hljs-title',
        'hljs-type',
        'hljs-variable',
      ],
    ],
  },
};

const GlobalStyle = createGlobalStyle`
  .dagster-markdown {
    .hljs-doctag,
    .hljs-keyword,
    .hljs-meta .hljs-keyword,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type,
    .hljs-variable.language_ {
      color: ${Colors.textBlue()}
    }

    .hljs-title,
    .hljs-title.class_,
    .hljs-title.class_.inherited__,
    .hljs-title.function_ {
      color: ${Colors.textBlue()};
    }

    .hljs-attr,
    .hljs-attribute,
    .hljs-literal,
    .hljs-meta,
    .hljs-number,
    .hljs-operator,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id,
    .hljs-variable {
      color: ${Colors.textLight()};
    }

    .hljs-meta .hljs-string,
    .hljs-regexp,
    .hljs-string {
      color: ${Colors.textCyan()};
    }

    .hljs-built_in,
    .hljs-symbol {
      color: ${Colors.textYellow()};
    }

    .hljs-code,
    .hljs-comment,
    .hljs-formula {
      color: ${Colors.textLight()};
    }

    .hljs-name,
    .hljs-quote,
    .hljs-selector-pseudo,
    .hljs-selector-tag {
      color: ${Colors.textGreen()};
    }
  }
`;

interface Props {
  children: string;
}

export const MarkdownWithPlugins = (props: Props) => {
  return (
    <>
      <GlobalStyle />
      <ReactMarkdown
        {...props}
        className="dagster-markdown"
        remarkPlugins={[gfm]}
        rehypePlugins={[
          ...(extended ? [rehypeRaw] : []),
          [rehypeHighlight, {ignoreMissing: true}],
          [rehypeSanitize, sanitizeConfig],
        ]}
      /> 
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default MarkdownWithPlugins;
