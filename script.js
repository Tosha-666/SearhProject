

const repoList = document.querySelector('.repo-list')
const arrOfUserItems =[]
const repoAddedContainer = document.querySelector('.repo-added__container')
const searchResults = document.querySelector('#searchValue')

//Создание списка поиска
const createList = function (item) {

  arrOfUserItems.push(item)
  const userRepo = document.createElement('li')
  userRepo.id = `${item.name}`
  userRepo.classList.add('userRepoItem')
  userRepo.innerHTML = `${item.name}`
  repoList.append(userRepo)
};

//Задержка ввода
const debounce = (fn, debounceTime) => {
  let timeout
    return function () {
      const fnCall =()=> {
        fn.apply(this, arguments)
      }
      clearTimeout(timeout)
      timeout = setTimeout(fnCall, debounceTime) 
    }
}
  
//Поиск и вывод результатов
const searchRepo = async function () {
  if (searchResults.value) {
    return await fetch(`https://api.github.com/search/repositories?q=${searchResults.value}&per_page=5&page=1`, {
    }).then(response => {
    
    if (response.ok) {

      response.json().then(response => {
        console.log(response);
        arrOfUserItems.length=0
        repoList.innerHTML=''
        response.items.forEach(element => {
            createList(element)
          });
        })
    } else {
      // Сообщение об ошибке
    }
  }
    )
  }
  else {
    repoList.innerHTML=''
  }
}

//Получение выбранного значения для создания списка репозиториев
const getValue = function (el,arr) {
  for (let i = 0; i<arr.length; i++) {
    if (arr[i].name == el) {
        return arr[i]
      }
  }
}

//Создание элемента выбранного репозиториия HTML
const createElemRepo = function (item) {
repoAddedContainer.insertAdjacentHTML("afterbegin",
  `<div class="repo-added__list">
  <div class="repo-added__item">
  <p class="repo-added__item--tag">Name: ${item.name}</p>
  <p class="repo-added__item--tag">Owner: ${item.owner.login}</p>
  <p class="repo-added__item--tag">Stars: ${item.stargazers_count}</p>
</div>
<div class="closebtn__wrapper">
  <span class="closebtn"></span>
</div>` 
  )
  searchResults.value = ''
  repoList.innerHTML = ''
};

//Выбор по клику в строке
const addRepo = function (event) {
  let LI = event.target.closest('li')
  if (!LI) {
    return
  } else {
  const selectedItem = LI.id
  const selectedData = getValue(selectedItem, arrOfUserItems)
  createElemRepo(selectedData)
  }
  
  }
 
  //Удаление выбранного репозитория
const deleteItem = function (event) {
  if (event.target.className === 'closebtn') {
    let targetItem = event.target.closest('.repo-added__list')
    targetItem.remove()
  }
  
}

//Слушатели
repoAddedContainer.addEventListener('click', deleteItem)
repoList.addEventListener('click', addRepo)
searchResults.addEventListener('keyup', debounce(searchRepo,300) )

