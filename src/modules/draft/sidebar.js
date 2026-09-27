export const sidebar = () => {
    const buSuanZi = () => {

        const script = () => {
            if (document.getElementById('bsz-script')) return
            const s = document.createElement('script')
            s.id = 'bsz-script'
            s.async = true
            s.defer = true
            s.src = 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js'
            document.body.appendChild(s)
        }

        const open = () => {
            document.querySelector('.bsz-box').showModal()
        }

        const close = () => {
            document.querySelector('.bsz-box').close()
        }

        return { script, open, close }
    }

    return { buSuanZi }
}