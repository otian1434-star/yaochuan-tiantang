(function () {
  'use strict';

  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !h || !createClass) return;

  function escapeHTML(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function inlineFormat(value) {
    var text = escapeHTML(value);
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/\[TAG:([^\]]+)\]/g, function (_, tag) {
      var colorMap = { '開服': 'red', '活動': 'red', '維護': 'blue', '更新': 'blue', '重要': 'red', '提示': 'blue', '完成': 'green', '成功': 'green' };
      var cls = colorMap[tag] || 'gold';
      return '<span class="cms-tag ' + cls + '">' + escapeHTML(tag) + '</span>';
    });
    return text;
  }

  function splitShortcodeParts(value) {
    return String(value || '').split('|').map(function (part) {
      return part.trim();
    });
  }

  function renderShortcodeLine(trimmed) {
    var match = trimmed.match(/^\[\[(HERO|GRID|PANEL|BUTTON):([\s\S]*)\]\]$/);
    if (!match) return '';
    var type = match[1];
    var parts = splitShortcodeParts(match[2]);

    if (type === 'HERO') {
      return '<div class="cms-hero-strip">' +
        '<h2>' + inlineFormat(parts[0] || '重點標題') + '</h2>' +
        (parts[1] ? '<p>' + inlineFormat(parts[1]) + '</p>' : '') +
        (parts[2] ? '<a class="cms-button" href="' + escapeHTML(parts[3] || '#') + '">' + inlineFormat(parts[2]) + '</a>' : '') +
        '</div>';
    }

    if (type === 'GRID') {
      return '<div class="cms-grid">' +
        '<div class="cms-panel"><h3>' + inlineFormat(parts[0] || '左側標題') + '</h3><p>' + inlineFormat(parts[1] || '左側內容') + '</p></div>' +
        '<div class="cms-panel"><h3>' + inlineFormat(parts[2] || '右側標題') + '</h3><p>' + inlineFormat(parts[3] || '右側內容') + '</p></div>' +
        '</div>';
    }

    if (type === 'PANEL') {
      return '<div class="cms-panel"><h3>' + inlineFormat(parts[0] || '卡片標題') + '</h3><p>' + inlineFormat(parts[1] || '卡片內容') + '</p></div>';
    }

    if (type === 'BUTTON') {
      return '<a class="cms-button" href="' + escapeHTML(parts[1] || '#') + '">' + inlineFormat(parts[0] || '查看詳情') + '</a>';
    }

    return '';
  }

  function renderMarkdown(value) {
    var lines = String(value || '').split('\n');
    var html = '';
    var inUl = false;
    var inOl = false;
    var inTable = false;

    function closeList() {
      if (inUl) { html += '</ul>'; inUl = false; }
      if (inOl) { html += '</ol>'; inOl = false; }
    }

    function closeTable() {
      if (inTable) { html += '</tbody></table>'; inTable = false; }
    }

    lines.forEach(function (line) {
      var trimmed = line.trim();

      if (trimmed.indexOf('|') === 0 && trimmed.lastIndexOf('|') === trimmed.length - 1) {
        var cells = trimmed.slice(1, -1).split('|').map(function (cell) { return cell.trim(); });
        if (cells.every(function (cell) { return /^[-: ]+$/.test(cell); })) return;
        closeList();
        if (!inTable) {
          html += '<table><thead><tr>';
          cells.forEach(function (cell) { html += '<th>' + inlineFormat(cell) + '</th>'; });
          html += '</tr></thead><tbody>';
          inTable = true;
        } else {
          html += '<tr>';
          cells.forEach(function (cell) { html += '<td>' + inlineFormat(cell) + '</td>'; });
          html += '</tr>';
        }
        return;
      }

      closeTable();

      if (!trimmed) {
        closeList();
        return;
      }
      var shortcode = renderShortcodeLine(trimmed);
      if (shortcode) {
        closeList();
        html += shortcode;
        return;
      }
      if (trimmed.indexOf('### ') === 0) {
        closeList();
        html += '<h3>' + inlineFormat(trimmed.slice(4)) + '</h3>';
        return;
      }
      if (trimmed.indexOf('## ') === 0) {
        closeList();
        html += '<h3>' + inlineFormat(trimmed.slice(3)) + '</h3>';
        return;
      }
      if (trimmed.indexOf('# ') === 0) {
        closeList();
        html += '<h2>' + inlineFormat(trimmed.slice(2)) + '</h2>';
        return;
      }
      if (trimmed === '---') {
        closeList();
        html += '<hr>';
        return;
      }
      if (trimmed === '===') {
        closeList();
        html += '<div class="cms-divider">- * * * -</div>';
        return;
      }
      if (trimmed.indexOf('!!! ') === 0) {
        closeList();
        html += '<div class="cms-callout red">' + inlineFormat(trimmed.slice(4)) + '</div>';
        return;
      }
      if (trimmed.indexOf('??? ') === 0) {
        closeList();
        html += '<div class="cms-callout blue">' + inlineFormat(trimmed.slice(4)) + '</div>';
        return;
      }
      if (trimmed.indexOf('+++ ') === 0) {
        closeList();
        html += '<div class="cms-callout green">' + inlineFormat(trimmed.slice(4)) + '</div>';
        return;
      }
      if (trimmed.indexOf('> ') === 0) {
        closeList();
        html += '<blockquote>' + inlineFormat(trimmed.slice(2)) + '</blockquote>';
        return;
      }
      if (trimmed.indexOf('- ') === 0 || trimmed.indexOf('* ') === 0 || trimmed.indexOf('• ') === 0) {
        if (inOl) { html += '</ol>'; inOl = false; }
        if (!inUl) { html += '<ul>'; inUl = true; }
        html += '<li>' + inlineFormat(trimmed.slice(2)) + '</li>';
        return;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        if (inUl) { html += '</ul>'; inUl = false; }
        if (!inOl) { html += '<ol>'; inOl = true; }
        html += '<li>' + inlineFormat(trimmed.replace(/^\d+\.\s/, '')) + '</li>';
        return;
      }

      closeList();
      html += '<p>' + inlineFormat(trimmed) + '</p>';
    });

    closeList();
    closeTable();
    return html;
  }

  function sanitizeTrustedHTML(value) {
    var template = document.createElement('template');
    template.innerHTML = String(value || '');
    template.content.querySelectorAll('script').forEach(function (node) {
      node.remove();
    });
    template.content.querySelectorAll('*').forEach(function (node) {
      Array.from(node.attributes).forEach(function (attr) {
        var name = attr.name.toLowerCase();
        var attrValue = String(attr.value || '').trim().toLowerCase();
        if (name.indexOf('on') === 0 || attrValue.indexOf('javascript:') === 0) {
          node.removeAttribute(attr.name);
        }
      });
    });
    return template.innerHTML;
  }

  function entryData(entry) {
    var data = entry && entry.getIn ? entry.getIn(['data']) : null;
    return data && data.toJS ? data.toJS() : {};
  }

  function renderPostPreviewBody(post) {
    var parts = [];
    if (post.coverImage) {
      parts.push('<img class="post-cover" src="' + escapeHTML(resolveAssetUrl(post.coverImage)) + '" alt="' + escapeHTML(post.title || '') + '">');
    }
    if (post.body || post.excerpt) {
      parts.push('<div class="cms-markdown">' + sanitizeTrustedHTML(renderMarkdown(post.body || post.excerpt || '')) + '</div>');
    }
    if (post.customHtml) {
      parts.push('<div class="cms-custom-html">' + sanitizeTrustedHTML(post.customHtml) + '</div>');
    }
    return parts.join('') || '<div class="yw-editor-empty">尚未輸入文章內容</div>';
  }

  function resolveAssetUrl(url) {
    var value = String(url || '').trim();
    if (!value || /^(https?:|data:|blob:|\/)/.test(value)) return value;
    return '../' + value.replace(/^\.?\//, '');
  }

  function safeClass(value, fallback) {
    return String(value || fallback || '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || fallback || 'standard';
  }

  function isPostLike(data) {
    return !!(data && (
      Object.prototype.hasOwnProperty.call(data, 'title') ||
      Object.prototype.hasOwnProperty.call(data, 'category') ||
      Object.prototype.hasOwnProperty.call(data, 'layout') ||
      Object.prototype.hasOwnProperty.call(data, 'body') ||
      Object.prototype.hasOwnProperty.call(data, 'customHtml')
    ));
  }

  function isHomeLike(data) {
    return !!(data && (
      Object.prototype.hasOwnProperty.call(data, 'sections') ||
      Object.prototype.hasOwnProperty.call(data, 'quickLinks') ||
      Object.prototype.hasOwnProperty.call(data, 'serverCards') ||
      Object.prototype.hasOwnProperty.call(data, 'updates')
    ));
  }

  function sectionHeading(section, fallbackEyebrow, fallbackTitle) {
    var item = section || {};
    return h('div', { className: 'section-header' }, [
      h('div', { className: 'section-eyebrow' }, item.eyebrow || fallbackEyebrow || ''),
      h('h2', { className: 'section-title' }, item.title || fallbackTitle || ''),
      h('div', { className: 'section-line' }),
    ]);
  }

  function emptyOfficialMessage(text) {
    return h('div', { className: 'cms-official-empty' }, text);
  }

  function visibleItems(items) {
    return (Array.isArray(items) ? items : []).filter(function (item) {
      return item && item.visible !== false;
    });
  }

  function renderHomeAnnouncements(data) {
    var section = data.sections && data.sections.announcements;
    return h('section', { className: 'section cms-preview-section' }, [
      h('div', { className: 'container' }, [
        sectionHeading(section, 'ANNOUNCEMENTS', '最新公告'),
        h('div', { className: 'ann-grid cms-preview-ann-grid' }, [
          h('div', { className: 'ann-card cms-preview-placeholder-card' }, [
            h('div', { className: 'ann-card-meta' }, [
              h('span', { className: 'ann-tag tag-sys' }, '文章'),
              h('span', { className: 'ann-date' }, '由文章管理產生'),
            ]),
            h('div', { className: 'ann-card-title' }, '最新公告會依「文章管理」的發布內容自動顯示'),
            h('div', { className: 'ann-card-excerpt' }, '此區塊在這裡預覽標題與按鈕文字；文章卡片請到「文章管理」新增或編輯。'),
            h('div', { className: 'ann-card-more' }, (section && section.buttonText) || '查看全部公告'),
          ]),
        ]),
      ]),
    ]);
  }

  function renderHomeQuickLinks(data) {
    var links = visibleItems(data.quickLinks);
    var section = data.sections && data.sections.quickLinks;
    return h('section', { className: 'section section-alt section-bg-quick cms-preview-section' }, [
      h('div', { className: 'container' }, [
        sectionHeading(section, 'QUICK NAVIGATION', '快速目錄'),
        links.length ? h('div', { className: 'dir-grid' }, links.map(function (link, index) {
          return h('div', {
            key: index,
            className: 'dir-card' + (link.highlight ? ' highlight' : ''),
          }, [
            h('span', { className: 'dir-icon' }, link.icon || '*'),
            h('span', { className: 'dir-name' }, link.title || '未命名'),
            h('span', { className: 'dir-desc' }, link.description || link.url || ''),
          ]);
        })) : emptyOfficialMessage('目前沒有顯示中的快速目錄卡片'),
      ]),
    ]);
  }

  function renderHomeUpdates(data) {
    var updates = visibleItems(data.updates);
    var section = data.sections && data.sections.updates;
    return h('section', { className: 'section cms-preview-section' }, [
      h('div', { className: 'container' }, [
        sectionHeading(section, 'PATCH NOTES', '更新歷程'),
        updates.length ? h('div', { className: 'update-list' }, updates.slice(0, 8).map(function (item, index) {
          return h('div', { key: index, className: 'update-item' }, [
            h('span', { className: 'update-date' }, item.date || ''),
            h('span', { className: 'update-tag' }, item.tag || ''),
            h('span', { className: 'update-content' }, item.content || item.title || ''),
          ]);
        })) : emptyOfficialMessage('目前沒有手動更新條列；前台仍會自動讀取「文章管理」中分類為「更新」的文章。'),
        h('div', { className: 'cms-preview-button-row' },
          h('span', { className: 'btn-outline cms-preview-fake-button' }, (section && section.buttonText) || '查看完整歷程')
        ),
      ]),
    ]);
  }

  function renderHomeServerInfo(data) {
    var cards = Array.isArray(data.serverCards) ? data.serverCards : [];
    var section = data.sections && data.sections.serverInfo;
    return h('section', { className: 'section section-bg-server cms-preview-section' }, [
      h('div', { className: 'container' }, [
        sectionHeading(section, 'SERVER INFO', '伺服器資訊'),
        cards.length ? h('div', { className: 'server-grid' }, cards.map(function (card, index) {
          var rows = Array.isArray(card.rows) ? card.rows : [];
          return h('div', { key: index, className: 'server-card' }, [
            h('div', { className: 'server-card-name' }, card.title || '未命名卡片'),
            h('div', { className: 'server-card-sub' }, card.subtitle || ''),
            rows.length ? rows.map(function (row, rowIndex) {
              return h('div', { key: rowIndex, className: 'server-info-row' }, [
                h('span', { className: 'server-info-key' }, row.label || ''),
                h('span', { className: 'server-info-val' + (row.highlight ? ' hl' : '') }, row.value || ''),
              ]);
            }) : emptyOfficialMessage('這張卡片尚未新增內容列'),
          ]);
        })) : emptyOfficialMessage('目前沒有伺服器資訊卡片'),
      ]),
    ]);
  }

  function renderHomePreview(data) {
    return h('div', { className: 'cms-preview-page cms-official-preview cms-home-preview' }, [
      h('div', { className: 'cms-preview-ribbon' }, '首頁底板即時預覽'),
      renderHomeAnnouncements(data),
      renderHomeQuickLinks(data),
      renderHomeUpdates(data),
      renderHomeServerInfo(data),
    ]);
  }

  function renderSinglePost(post, index) {
    var item = post || {};
    return h('article', {
      key: index || 0,
      className: 'post-card post-layout-' + safeClass(item.layout, 'standard'),
    }, [
      h('div', { className: 'cms-preview-post-kicker' }, [
        h('span', {}, item.published === false ? '尚未顯示於網站' : '網站文章預覽'),
        item.pinned ? h('strong', {}, '置頂') : null,
      ]),
      h('h2', {}, item.title || '未命名文章'),
      h('div', { className: 'post-meta' }, [
        h('span', {}, item.category || '公告'),
        h('span', {}, item.date || '尚未設定日期'),
        h('span', {}, item.layout || 'standard'),
      ]),
      item.excerpt ? h('p', { className: 'cms-preview-excerpt' }, item.excerpt) : null,
      h('div', {
        className: 'post-body cms-rich',
        dangerouslySetInnerHTML: { __html: renderPostPreviewBody(item) },
      }),
    ]);
  }

  function renderPostsPreview(posts) {
    var items = (Array.isArray(posts) ? posts : []).filter(function (post) {
      return post && post.published !== false;
    });

    return h('div', { className: 'cms-preview-page cms-official-preview cms-posts-preview' }, [
      h('div', { className: 'cms-preview-ribbon' }, '文章頁即時預覽'),
      h('section', { className: 'section cms-preview-section' }, [
        h('div', { className: 'container' }, [
          sectionHeading({ eyebrow: 'NEWS', title: '最新文章' }, 'NEWS', '最新文章'),
          items.length ? items.map(renderSinglePost) : h('div', { className: 'post-card' },
            h('div', { className: 'post-body cms-rich' }, '目前尚無已顯示的文章，請新增文章或打開「顯示在網站」。')
          ),
        ]),
      ]),
    ]);
  }

  function insertAt(text, start, end, before, after) {
    var selected = text.slice(start, end) || '文字';
    var next = text.slice(0, start) + before + selected + after + text.slice(end);
    return {
      value: next,
      start: start + before.length,
      end: start + before.length + selected.length,
    };
  }

  function tableTemplate() {
    return '\n| 欄位一 | 欄位二 | 欄位三 |\n| --- | --- | --- |\n| 內容 | 內容 | 內容 |\n| 內容 | 內容 | 內容 |\n';
  }

  var SHORTCODES = {
    hero: '\n[[HERO:重點活動標題|這裡輸入活動說明或公告重點|查看詳情|/pages/events.html]]\n',
    grid: '\n[[GRID:活動時間|2026/06/01 至 2026/06/07|活動獎勵|登入獎勵、推廣獎勵、限定道具]]\n',
    panel: '\n[[PANEL:重點說明|這裡輸入需要被框起來的補充內容。]]\n',
    button: '\n[[BUTTON:前往查看|/pages/news.html]]\n',
  };

  var TEMPLATES = {
    announcement: '# [TAG:活動] 活動公告標題\n\n[[HERO:活動重點|活動期間登入即可獲得限定獎勵，完成指定任務還能追加領取。|查看活動|/pages/events.html]]\n\n## 活動內容\n\n[[GRID:活動時間|2026/03/01 20:00 至 2026/03/07 23:59|活動獎勵|登入獎勵、推文獎勵、限定道具]]\n\n- 限時雙倍經驗值\n- 登入即送 **藍鑽 x100**\n- 推文可獲得額外獎勵\n\n!!! 本活動獎勵為一次性發放，請務必在期限內領取。\n\n+++ 如有任何問題，請聯繫官方 LINE 客服。',
    update: '# 版本更新公告\n\n[TAG:維護] 維護時間：2026/03/05 00:00 - 06:00\n\n[[PANEL:維護提醒|維護期間玩家將暫時無法登入，請提前下線避免資料異常。]]\n\n## 本次更新內容\n\n### 新增內容\n- 新增世界 BOSS\n- 新增活動獎勵\n\n### 調整優化\n- 優化伺服器連線穩定性\n- 調整部分掉落設定\n\n---\n\n!!! 維護完成後請重新開啟登入器取得最新設定。',
    guide: '# 系統介紹標題\n\n## 基本說明\n\n在這裡輸入系統的基本說明。\n\n[[GRID:核心特色|特色一、特色二、特色三|適合玩家|新手、回鍋、長期玩家皆可參與]]\n\n## 功能特色\n\n- 特色一：說明內容\n- 特色二：說明內容\n- 特色三：說明內容\n\n??? 如有不清楚的地方，可詢問管理員。',
    rules: '# 規則條款標題\n\n## 第一章 基本規範\n\n- 禁止規則一\n- 禁止規則二\n- 禁止規則三\n\n!!! 違反上述規範者，管理團隊將視情節輕重給予處罰。\n\n## 處罰辦法\n\n| 違規行為 | 處罰方式 | 備註 |\n| --- | --- | --- |\n| 輕度違規 | 警告 1 次 | 首次違規 |\n| 中度違規 | 暫停帳號 7 天 | 累計 2 次 |',
    item: '# 道具名稱\n\n## 基本資訊\n\n| 屬性 | 內容 |\n| --- | --- |\n| 道具類型 | 消耗品 / 裝備 |\n| 取得方式 | BOSS 掉落 / 商城購買 |\n\n## 道具效果\n\n- 效果一：說明\n- 效果二：說明\n\n!!! 此道具使用後無法退還，請確認後再使用。',
  };

  var FormattingControl = createClass({
    getDefaultProps: function () {
      return { value: '' };
    },

    getInitialState: function () {
      return { previewMode: 'desktop' };
    },

    setTextarea: function (node) {
      this.textarea = node;
    },

    changeValue: function (value) {
      this.props.onChange(value);
    },

    insertSyntax: function (before, after) {
      var textarea = this.textarea;
      var value = this.props.value || '';
      var start = textarea ? textarea.selectionStart : value.length;
      var end = textarea ? textarea.selectionEnd : value.length;
      var result = insertAt(value, start, end, before, after || '');
      this.changeValue(result.value);
      window.setTimeout(function () {
        if (!textarea) return;
        textarea.focus();
        textarea.selectionStart = result.start;
        textarea.selectionEnd = result.end;
      }, 0);
    },

    insertRaw: function (raw) {
      var textarea = this.textarea;
      var value = this.props.value || '';
      var start = textarea ? textarea.selectionStart : value.length;
      var next = value.slice(0, start) + raw + value.slice(start);
      this.changeValue(next);
      window.setTimeout(function () {
        if (!textarea) return;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + raw.length;
      }, 0);
    },

    applyTemplate: function (name) {
      var value = this.props.value || '';
      if (value.trim() && !window.confirm('套用範本會覆蓋目前內文，確定繼續？')) return;
      this.changeValue(TEMPLATES[name] || '');
    },

    clearAll: function () {
      if (!window.confirm('確定清除內文？')) return;
      this.changeValue('');
    },

    setPreviewMode: function (mode) {
      this.setState({ previewMode: mode });
    },

    renderButton: function (label, before, after, className) {
      var self = this;
      return h('button', {
        type: 'button',
        className: 'yw-editor-button' + (className ? ' ' + className : ''),
        onClick: function () { self.insertSyntax(before, after || ''); },
      }, label);
    },

    renderTemplateButton: function (label, name) {
      var self = this;
      return h('button', {
        type: 'button',
        className: 'yw-editor-button',
        onClick: function () { self.applyTemplate(name); },
      }, label);
    },

    renderInsertButton: function (label, raw) {
      var self = this;
      return h('button', {
        type: 'button',
        className: 'yw-editor-button',
        onClick: function () { self.insertRaw(raw); },
      }, label);
    },

    renderDeviceButton: function (label, mode) {
      var self = this;
      var active = this.state.previewMode === mode;
      return h('button', {
        type: 'button',
        className: 'yw-device-button' + (active ? ' active' : ''),
        onClick: function () { self.setPreviewMode(mode); },
      }, label);
    },

    render: function () {
      var self = this;
      var value = this.props.value || '';
      var preview = value.trim() ? renderMarkdown(value) : '<div class="yw-editor-empty">開始輸入文章後，這裡會即時預覽網站排版</div>';
      var previewMode = this.state.previewMode || 'desktop';

      return h('div', { className: this.props.classNameWrapper },
        h('div', { className: 'yw-editor' }, [
          h('div', { className: 'yw-editor-toolbar' }, [
            this.renderButton('H1', '# ', ''),
            this.renderButton('H2', '## ', ''),
            this.renderButton('H3', '### ', ''),
            this.renderButton('粗體', '**', '**'),
            this.renderButton('代碼', '`', '`'),
            this.renderButton('引用', '> ', ''),
            this.renderButton('清單', '- ', ''),
            this.renderButton('編號', '1. ', ''),
            h('button', { type: 'button', className: 'yw-editor-button', onClick: function () { self.insertRaw(tableTemplate()); } }, '表格'),
            this.renderButton('分隔線', '\n---\n', ''),
            this.renderButton('章節線', '\n===\n', ''),
            this.renderButton('警示', '!!! ', ''),
            this.renderButton('提示', '??? ', ''),
            this.renderButton('完成', '+++ ', ''),
            this.renderButton('標籤', '[TAG:', ']'),
            this.renderInsertButton('重點橫幅', SHORTCODES.hero),
            this.renderInsertButton('雙欄卡片', SHORTCODES.grid),
            this.renderInsertButton('卡片', SHORTCODES.panel),
            this.renderInsertButton('按鈕', SHORTCODES.button),
            h('button', { type: 'button', className: 'yw-editor-button danger', onClick: this.clearAll }, '清除'),
          ]),
          h('div', { className: 'yw-editor-templates' }, [
            this.renderTemplateButton('活動公告範本', 'announcement'),
            this.renderTemplateButton('更新公告範本', 'update'),
            this.renderTemplateButton('攻略範本', 'guide'),
            this.renderTemplateButton('規章範本', 'rules'),
            this.renderTemplateButton('道具範本', 'item'),
          ]),
          h('div', { className: 'yw-editor-grid' }, [
            h('div', { className: 'yw-editor-pane' }, [
              h('div', { className: 'yw-editor-head' }, [
                h('span', {}, '文章內文'),
                h('span', { className: 'yw-editor-count' }, value.length + ' 字'),
              ]),
              h('textarea', {
                id: this.props.forID,
                ref: this.setTextarea,
                className: 'yw-editor-textarea',
                value: value,
                placeholder: '# 文章標題\n\n## 段落標題\n\n- 清單項目\n- 清單項目\n\n!!! 重要提醒\n\n| 欄位一 | 欄位二 |\n| --- | --- |\n| 內容 | 內容 |',
                onChange: function (event) { self.changeValue(event.target.value); },
              }),
            ]),
            h('div', { className: 'yw-editor-pane' }, [
              h('div', { className: 'yw-editor-head' }, [
                h('span', {}, '即時預覽'),
                h('span', { className: 'yw-device-switch' }, [
                  this.renderDeviceButton('桌面', 'desktop'),
                  this.renderDeviceButton('手機', 'mobile'),
                ]),
              ]),
              h('div', {
                className: 'yw-editor-preview yw-preview is-' + previewMode,
              }, h('article', { className: 'post-card post-layout-standard yw-preview-card' }, [
                h('div', {
                  className: 'post-body cms-rich',
                  dangerouslySetInnerHTML: { __html: preview },
                }),
              ])),
            ]),
          ]),
        ])
      );
    },
  });

  var SiteDataPreview = createClass({
    render: function () {
      var data = entryData(this.props.entry);

      if (Array.isArray(data.posts)) return renderPostsPreview(data.posts);
      if (isPostLike(data)) {
        return h('div', { className: 'cms-preview-page cms-official-preview cms-posts-preview' }, [
          h('div', { className: 'cms-preview-ribbon' }, '文章頁即時預覽'),
          h('section', { className: 'section cms-preview-section' },
            h('div', { className: 'container' }, renderSinglePost(data, 0))
          ),
        ]);
      }
      if (isHomeLike(data)) return renderHomePreview(data);

      return h('div', { className: 'cms-preview-page cms-official-preview' },
        h('div', { className: 'post-card' },
          h('div', { className: 'post-body cms-rich' }, '請開始編輯左側欄位，右側會顯示網站樣式預覽。')
        )
      );
    },
  });

  CMS.registerWidget('yaowu_markdown', FormattingControl);
  CMS.registerPreviewStyle('../assets/css/style.css');
  CMS.registerPreviewStyle('./formatting-widget.css');
  CMS.registerPreviewTemplate('site_data', SiteDataPreview);
  CMS.registerPreviewTemplate('posts', SiteDataPreview);
  CMS.registerPreviewTemplate('home', SiteDataPreview);
})();
