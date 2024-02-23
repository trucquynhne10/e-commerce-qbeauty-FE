const commentSection = document.querySelector('.product-reviews__comments')
const nut = document.querySelector('#nut')
const filterBtns = document.querySelectorAll('.product-reviews__filter')
const commentBox = document.querySelector('#comment-box')
const productReviews = document.querySelector('.product-reviews')

let currentCriteria = 'all'
let comments = []

const predictComment = async () => {
    const comment = document.querySelector('#comment-box').value
    if (comment !== null && comment !== '') {
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cmt: comment })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const result = await response.json()
            return result
        } catch (error) {
            console.error(
                'There was a problem with your fetch operation:',
                error
            )
        }
    }
}

nut.addEventListener('click', async function () {
    if (commentBox.value === '') return
    const newCmt = await predictComment()
    comments = [newCmt, ...comments]

    document
        .querySelector('.product-reviews__filter--active')
        .classList.remove('product-reviews__filter--active')
    filterBtns[0].classList.add('product-reviews__filter--active')
    currentCriteria = 'all'
    renderCmts()

    commentBox.value = ''
    productReviews.scrollIntoView({ behavior: 'smooth' })
})

window.addEventListener('load', async () => {
    const response = await fetch('http://127.0.0.1:5000/predict')
    const data = await response.json()
    comments = data.slice(0, 10)
    renderCmts()
})

const renderCmts = () => {
    const cmtToRenders =
        currentCriteria === 'all'
            ? comments
            : comments.filter((item) => item.predict.includes(currentCriteria))

    const htmls = cmtToRenders.map(
        (cmt) => `
            <div class="product-reviews__comment">
                <ul class="item-reviewer">
                    <div class="comment-item-user">
                        <div
                            class="comment-item-user-img-wrapper"
                        >
                            <img
                                src="https://haycafe.vn/wp-content/uploads/2021/11/Anh-avatar-dep-chat-lam-hinh-dai-dien.jpg"
                                alt=""
                                class="comment-item-user-img"
                            />
                        </div>
                        <li><b>Nguyễn Nhung</b></li>
                    </div>
                    <li>
                        <p class="cmt-content">${cmt.cmt}</p>
                    </li>
                    <div class="prediction">Tags: ${
                        cmt.predict.length > 0
                            ? cmt.predict.join(', ')
                            : '(None)'
                    }</div>
                </ul>
            </div>
        `
    )
    commentSection.innerHTML = htmls.join('')
}

filterBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
        document
            .querySelector('.product-reviews__filter--active')
            .classList.remove('product-reviews__filter--active')

        this.classList.add('product-reviews__filter--active')

        currentCriteria = this.dataset.filter
        renderCmts()
    })
})
