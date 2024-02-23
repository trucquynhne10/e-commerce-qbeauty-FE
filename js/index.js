const product = document.querySelector('.product__info')
let allProducts
let page = 1

onload = fetch('Datasp.csv')
    .then((res) => {
        return res.text()
    })
    .then((data) => {
        allProducts = data.split(/\r?\n|\r/).map((e) => {
            e = e.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
            e = e.map((entry) => entry.replace(/"/g, '')) // Replace all double quotes with an empty string
            return e
        })
        allProducts = allProducts.slice(1, 230)

        render()
    })

// Render products
const render = () => {
    const limit = 16
    const skip = (page - 1) * limit
    const result = allProducts.slice(skip + 1, skip + limit)
    let html = result
        .map(
            (e) => `
            <div class="grid__column-2-4">
                <a class="home-product-item" href="#">
                    <div class="home-product-item__img" style="background-image: url(https://down-vn.img.susercontent.com/file/2ce91a9404973b52dda077f16227cf02_tn);"></div>
                    <h4 class="home-product-item__name"><p>${e[0]}</p></h4>
                    <div class="home-product-item__price">
                        <span class="home-product-item__price-old">${e[1]}</span>
                        <span class="home-product-item__price-current">${e[2]}</span>
                    </div>
                    <div class="home-product-item__action">
                        <span class="home-product-item__like home-product-item__like--liked">
                            <i class="home-product-item__like-icon-empty fa-regular fa-heart"></i>
                            <i class="home-product-item__like-icon-fill fa-solid fa-heart"></i>
                        </span>
                        <div class="home-product-item__rating">
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                            <i class="home-product-item__star--gold fa-solid fa-star"></i>
                        </div>
                        <span class="home-product-item__sold">${e[3]}</span>
                    </div>
                    <div class="home-product-item__origin">
                        <span class="home-product-item__brand">Ohana</span>
                        <span class="home-product-item__origin-name">${e[4]}</span>
                    </div>
                    <div class="home-product-item__favourite">
                        <i class="fa-solid fa-check"></i>
                        <span>Yêu thích</span>
                    </div>
                    <div class="home-product-item__sale-off">
                        <span class="home-product-item__sale-off-percent">43%</span>
                        <span class="home-product-item__sale-off-label">GIẢM</span>
                    </div>
                </a>
            </div>
        `
        )
        .join('') // Join all HTML strings into a single string

    product.innerHTML = html
}

const pageBtn = document
    .querySelectorAll('.pagination-item__link')
    .forEach((item) =>
        item.addEventListener('click', (e) => {
            e.preventDefault()
            page = Number(e.target.innerText)

            // Remove active class
            document
                .querySelector('.pagination-item__link.active')
                .classList.remove('active')

            e.target.classList.add('active')
            render()
        })
    )

const formData = new FormData()
formData.append('cmt', 'Nội dung bình luận')

fetch('/predict', {
    method: 'POST',
    body: formData
})
    .then((response) => response.json())
    .then((data) => {
        // Xử lý kết quả dự đoán ở đây
        console.log('Dự đoán:', data.predictions)
        console.log('Bình luận:', data.comment)
    })
    .catch((error) => {
        console.error('Lỗi:', error)
    })
