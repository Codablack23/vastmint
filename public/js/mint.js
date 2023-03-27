const useAtt = ()=>{
    let att = []
    return [
        ()=>att,
        (newData)=>{
             att = newData
             renderAttributes(att,attEl)
         }
    ]

}
const useStep = ()=>{
    let step = 1
    return [
        ()=>step,
        (new_step,)=>{
            step = new_step
            renderChange(new_step,step1,step2,step3)
         }
    ]
}
const usePayment = ()=>{
    let isPaid = false
    return [
        ()=>isPaid,
        (newValue)=>{
            isPaid = newValue
         }
    ]
}
const useRequest = ()=>{
    let requestData = null;
    return [
      ()=>requestData,
      (newData)=>{requestData = newData}
    ]
}
const useID = ()=>{
    let payment_id = null
    return [
        ()=>payment_id,
        (id)=>{
            payment_id = id
        }
    ]
}
const useImg = ()=>{
    let imgObj = null
    return [
        ()=>imgObj,
        (img)=>{
            imgObj = img
        }
    ]
}
const useImgUrl = ()=>{
    let imgUrl = null
    return [
        ()=>imgUrl,
        (img)=>{
            imgUrl = img
        }
    ]
}

const [getStep,setStep] = useStep()
const [getAtt,setAtt] = useAtt()
const [getRequestData,setRequestData] = useRequest()
const [getID,setID] = useID()
const [getImg,setImg] = useImg()
const [getImgUrl,setImgUrl] = useImgUrl()
const [getPaidStatus,setPaidStatus] = usePayment()

function showError(errEl,errMessage){
   const errtext = errEl.querySelector(".error-message")
   errtext.innerHTML = errMessage
   errEl.classList.remove("hide")
}
function hideError(errEl){
    errEl.classList.add("hide")
 }

const step1 = document.querySelector("#step-1")
const step2 = document.querySelector("#step-2")
const step3 = document.querySelector("#step-3")
const mintBtn = document.querySelector("#mint")
const backBtn = document.querySelectorAll(".back-btn")
const attEl = document.querySelector("#nft-att")
const fileInput= document.querySelector("#nft-img")
const uploadBtn= document.querySelector("#upload-btn")
const addAttrForm = document.querySelector("#add-attr-form")
const closeModalButton = document.querySelector("#add-attr-cancel-btn")
const loader = document.querySelector("#loader")


const generateEL=({attribute,id,})=>{
    const div = document.createElement("div")
    div.className = "rounded-pill d-flex justify-content-between align-items-center grid-col-4 grid-col-md-6 grid-col-sm-12 px-3 p-1 w3-card"
    const p = document.createElement("p")
    const pText = document.createTextNode(attribute)
    p.classList.add("m-0")
    p.appendChild(pText)
    const button = document.createElement("button")
    button.className = "btn btn-small p-0 vastmint-text-light-300"
    button.type = "button"
    button.addEventListener("click",()=>{
        const prevData = getAtt()
        setAtt(prevData.filter((attr)=>attr.id !== id))
    })
    const i = document.createElement("i")
    i.className = "bi bi-x"
    button.appendChild(i)

    div.appendChild(p)
    div.appendChild(button)

    return div

}

const renderChange=(current_step,step1El,step2El,step3El)=>{
    if(current_step == 1){
        step1El.classList.remove("hide")
        step2El.classList.add("hide")
    }else if(current_step == 2){
        const isPaid =  getPaidStatus();
        if(isPaid){
            step1El.classList.add("hide")
            step2El.classList.add("hide")
            step3El.classList.remove("hide")
        }else{
        step1El.classList.add("hide")
        step2El.classList.remove("hide")
        }
    }else{
        step1El.classList.add("hide")
        step2El.classList.add("hide")
    }
}
const renderAttributes=(data,target)=>{
    const container = document.createElement("div")
    container.classList.add("vastmint-grid")
    data.forEach((item)=>{
        container.appendChild(generateEL(item))
    })
    
    target.replaceChildren(container)
}





step1.addEventListener("submit",async (e)=>{
    e.preventDefault()
    const errorEl = document.querySelector("#add-nft-err")
    const name = e.target['name'].value
    const price = e.target['price'].value
    const description =e.target['description'].value
    const attributes = getAtt()
    if(attributes.length > 0){
        const nft_img = getImgUrl()
        hideError(errorEl)
        setRequestData({
            name,
            price,
            description,
            attributes,
            nft_img
        })
        const data = getRequestData()
        localStorage.setItem("requestData",JSON.stringify({
            ...data,
            createdAt:new Date()
        }))
        toggleLoader(loader,false)
        try {
            toggleLoader(loader,false)
            const response = await fetch("/api/wallet/check-balance",{
                method:"POST",
                headers: {
                    'Content-Type':'application/json',
                    'Accept':'application/json'
                },
                body:JSON.stringify({
                    name
                })
            })
            const data = await response.json()
            toggleLoader(loader,true)
            if(data.status == "success"){
              hideError(errorEl)
              setStep(2)
            }else{
                showError(errorEl,data.err)
            }
        } catch (error) {
            toggleLoader(loader,true)
            console.log(error)
            showError(errorEl,"Sorry could not connect to servers")
        }
        toggleLoader(loader,true)

    }else{
        showError(errorEl,"Please add atleast one nft attribute")
    }
    
})
addAttrForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const errorEl = document.querySelector("#add-attr-err")
    const attribute = e.target['attribute'].value
    const feature = e.target['feature'].value
    const description =e.target['description'].value
    const prevData = getAtt()
    const existingAtt = prevData.find((d)=>d.attribute === attribute)
    if(existingAtt){
        showError(errorEl,"attribute already exist")
    }else{
        hideError(errorEl)
        closeModalButton.click()
        e.target.reset()
        setAtt([...prevData,{
            attribute,
            feature,
            description,
            id:prevData.length > 0 ?prevData.length + 1:1
        }])
    }
})

function toggleLoader(loaderEl,hidden=false){
   if(hidden){
    loaderEl.classList.remove("d-flex")
    loaderEl.classList.add("hide")
   }else{
    loaderEl.classList.add("d-flex")
    loaderEl.classList.remove("hide")
   }
}
fileInput.addEventListener("change",(e)=>{
    const dropZone = document.querySelector("#drop-zone")
    const preview = document.querySelector("#preview-box")
    const errEL= document.querySelector("#file-err")
    const img = document.querySelector("#preview")
    // console.log(fileInput)
    errEL.classList.add("hide")
    const file = e.target.files[0]
    if(file.type.startsWith("image/")){
        setImg(file)
        const reader = new FileReader();
        img.file = file
        reader.onload = (e) => {
         img.src = e.target.result;
         preview.classList.remove("hide")
         img.classList.remove("d-none")
         dropZone.classList.add("hide")
        };
        reader.readAsDataURL(file);

    }else{
       errEL.classList.remove("hide")
       const errText = errEL.querySelector(".error-message")
       errText.innerHTML = "Please select a valid image"
    }
})
uploadBtn.addEventListener("click",async(e)=>{
    const errEL= document.querySelector("#file-err")
    const dropZone = document.querySelector("#drop-zone")
    const preview = document.querySelector("#preview-box")
    const success = document.querySelector("#success")

    const file = getImg()
    const reqData = new FormData()
    reqData.append("file",file)
    reqData.append("user","data")
    try {
        toggleLoader(loader,false)
        const response = await fetch("/upload/",{
            method:"POST",
            body:reqData
        })
        const data = await response.json()
        toggleLoader(loader,true)
        if(data.status == "success"){
          hideError(errEL)
          const reqData = getRequestData()
          setImgUrl(data.img_url)
          setRequestData({
            ...reqData,
            nft_img:getImgUrl()
          })
          dropZone.classList.add("hide")
          preview.classList.add("hide")
          success.classList.remove("hide")
        }else{
            showError(errEL,data.err)
        }
    } catch (error) {
        toggleLoader(loader,true)
        console.log(error)
        showError(errEL,"Sorry could not connect to servers")
    }
})
// window.addEventListener('load',()=>{
//     renderChange(3,step1,step2,step3)
// })

mintBtn.addEventListener('click',async(e)=>{
    const errEL= document.querySelector("#file-err")
    const success = document.querySelector("#success")
    const successCreate = document.querySelector("#created-success")
    const viewMint = document.querySelector("#view-mint")
    try {
        toggleLoader(loader,false)
        const res = await fetch(`/api/nft/mint`,{
            method:"POST",
            headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify(getRequestData())
           })
        
        const resData = await res.json()
        toggleLoader(loader,true)
        console.log(resData)
        if(resData.status == "failed"){
            showError(errEL,resData.err)
        }else{
          hideError(errEL)
          success.classList.add("hide")
          successCreate.classList.remove("hide")
          viewMint.href = `/dashboard/art/${resData.data.nft_id}`
        }
    } catch (error) {
        showError(errEL,"Sorry could not connect to sever")
    }
})

backBtn.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const step = getStep()
        const isPaid = getPaidStatus()
            setStep(step - 1)
    })
})