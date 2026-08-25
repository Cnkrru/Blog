/**
 * 搜索评分算法 — Elasticsearch-like 搜索评分器
 * 将Elasticsearch的搜索算法思想应用到前端
 */

export class ElasticsearchLikeScorer {
  fieldWeights
  bm25Params
  invertedIndex
  fieldLengths
  totalDocs
  fieldDocFreq

  constructor() {
    this.fieldWeights = {
      title: 3.0,
      tags: 2.0,
      category: 1.5,
      description: 1.0
    }

    this.bm25Params = {
      k1: 1.2,
      b: 0.75,
      avgFieldLengths: new Map()
    }

    this.invertedIndex = new Map()
    this.fieldLengths = new Map()
    this.totalDocs = 0
    this.fieldDocFreq = new Map()
  }

  buildInvertedIndex(documents) {
    this.totalDocs = documents.length

    documents.forEach((doc) => {
      const docId = doc.id
      this.fieldLengths.set(docId, {})

      Object.keys(this.fieldWeights).forEach(field => {
        if (doc[field]) {
          const terms = this.tokenizeField(doc[field], field)
          const fieldLength = terms.length

          this.fieldLengths.get(docId)[field] = fieldLength
          this.updateAvgFieldLength(field, fieldLength)

          terms.forEach(term => {
            if (!this.invertedIndex.has(term)) {
              this.invertedIndex.set(term, new Map())
            }
            const termDocs = this.invertedIndex.get(term)
            if (!termDocs.has(docId)) {
              termDocs.set(docId, {})
            }
            if (!termDocs.get(docId)[field]) {
              termDocs.get(docId)[field] = 0
            }
            termDocs.get(docId)[field]++

            this.updateDocumentFrequency(term, field, docId)
          })
        }
      })
    })

    }

  tokenizeField(text, field) {
    if (field === 'tags' && Array.isArray(text)) {
      return text.map((tag) => tag.toLowerCase())
    }

    const textStr = text.toString().toLowerCase()
    const hasChinese = /[\u4e00-\u9fa5]/.test(textStr)

    if (hasChinese) {
      const chars = textStr.split('').filter(char => /[\u4e00-\u9fa5]/.test(char))
      const words = []

      chars.forEach(char => {
        if (char.length > 0) words.push(char)
      })

      let currentPhrase = ''
      for (let i = 0; i < textStr.length; i++) {
        const char = textStr[i]
        if (/[\u4e00-\u9fa5]/.test(char)) {
          currentPhrase += char
        } else {
          if (currentPhrase.length > 1) words.push(currentPhrase)
          currentPhrase = ''
        }
      }
      if (currentPhrase.length > 1) words.push(currentPhrase)

      return words
    } else {
      return textStr
        .split(/[\s\-\_]+/)
        .filter(word => word.length > 1)
    }
  }

  updateAvgFieldLength(field, length) {
    if (!this.bm25Params.avgFieldLengths.has(field)) {
      this.bm25Params.avgFieldLengths.set(field, { sum: 0, count: 0 })
    }
    const stats = this.bm25Params.avgFieldLengths.get(field)
    stats.sum += length
    stats.count++
  }

  updateDocumentFrequency(term, field, docId) {
    if (!this.fieldDocFreq.has(field)) {
      this.fieldDocFreq.set(field, new Map())
    }
    const termMap = this.fieldDocFreq.get(field)
    if (!termMap.has(term)) {
      termMap.set(term, new Set())
    }
    termMap.get(term).add(docId)
  }

  calculateDocumentFrequency(term, field) {
    const termMap = this.fieldDocFreq.get(field)
    if (!termMap || !termMap.has(term)) return 0
    return termMap.get(term).size
  }

  score(docId, queryTerms) {
    let totalScore = 0

    queryTerms.forEach(({ term, weight }) => {
      const termDocs = this.invertedIndex.get(term)
      if (!termDocs || !termDocs.has(docId)) return

      const docStats = termDocs.get(docId)
      const docLengths = this.fieldLengths.get(docId)

      Object.keys(docStats).forEach(field => {
        const tf = docStats[field]
        const fieldLength = docLengths[field] || 1
        const avgStats = this.bm25Params.avgFieldLengths.get(field)
        const avgFieldLength = avgStats ? avgStats.sum / avgStats.count : 1
        const fieldWeight = this.fieldWeights[field] || 1.0

        const df = this.calculateDocumentFrequency(term, field)
        const idf = Math.log((this.totalDocs - df + 0.5) / (df + 0.5) + 1)

        const numerator = tf * (this.bm25Params.k1 + 1)
        const denominator = tf + this.bm25Params.k1 *
          (1 - this.bm25Params.b +
           this.bm25Params.b * (fieldLength / avgFieldLength))

        totalScore += fieldWeight * weight * idf * (numerator / denominator)
      })
    })

    return totalScore
  }

  search(query, documents, limit = 20) {
    const queryTerms = this.tokenizeField(query, 'query')
      .map(term => ({ term, weight: 1.0 }))

    const scoredDocs = documents.map((doc) => {
      const s = this.score(doc.id, queryTerms)
      return { doc, score: s }
    })

    return scoredDocs
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.doc)
  }

  getIndexStats() {
    let totalTerms = 0
    this.invertedIndex.forEach(docs => {
      totalTerms += docs.size
    })

    return {
      totalDocs: this.totalDocs,
      totalTerms: this.invertedIndex.size,
      avgTermsPerDoc: totalTerms / this.totalDocs,
      fieldWeights: this.fieldWeights,
      avgFieldLengths: Object.fromEntries(this.bm25Params.avgFieldLengths)
    }
  }
}