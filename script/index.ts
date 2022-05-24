//============= Set || Nodes || ==================> 
const audio = document.querySelector('.audio') as HTMLAudioElement;
const start_quest = document.querySelector('#start_quest') as HTMLElement;
const quset_cont = document.querySelector('.quset_cont') as HTMLElement;
const quest_index = document.querySelector('.quest_index') as HTMLElement;
const answer = document.querySelector('.answers') as HTMLElement;
const quest_index_num = document.querySelector('.quest_index_num') as HTMLElement;
const remove_2 = document.querySelector('.remove_2') as HTMLElement;
const google = document.querySelector('.google') as HTMLElement;
const answers = document.querySelectorAll('.answer') as NodeListOf<HTMLElement>;
const audio_cotroll_img = document.querySelectorAll('.audio_cotroll img') as NodeListOf<HTMLElement> ;
let start = 0;
let answer_data;
//============= Set || Nodes || ==================>





//======= Set || classes || =======>

class DrawUi {
    data:string;
    index:number;
    state:boolean;
    constructor(data:string, index:number) {
        this.data = data;
        this.index = index;
        this.state = true;
    }

    //======= Draw || All ||  Content || Ui =======>
    draw() {
        if (this.data != undefined && this.index != undefined) {
            fetch(this.data).then(response => response.json()).then(values => {
                this.stop_Quiz(values);
                if (this.state) {
                    this.draw_Quest(values);
                    this.draw_Quest_line(values);
                }
            })
        } else {
            console.warn('please Enter data src and index of start');
        }
    }
    //======= Draw || All ||  Content || Ui =======>


    //======= Draw || Questions || Answers =======>
    draw_Quest(values:any) {
        let recust = ['a', 'b', 'c', 'd'];
        quset_cont.innerText = values[this.index].quest;
        answers.forEach((ele, index) => {
            ele.innerText = values[this.index][recust[index]];
        });
        quest_index.innerText = `Question ${this.index + 1}`;
    }
    //======= Draw || Questions || Answers =======>


    //======= Draw || Questions || Lines =======>
    draw_Quest_line(values:NodeListOf<HTMLElement>) {
        const quest_index_num_elements = quest_index_num.children;
        if (quest_index_num_elements.length == 0) {
            values.forEach((ele:HTMLElement, index:number) => {
                quest_index_num.innerHTML += `<p>${index + 1}</p>`;
            })
        }
        Array.from(quest_index_num_elements).forEach(ele => {
            ele.classList.remove('active_point_quest');
        })
        quest_index_num_elements[this.index].classList.add('active_point_quest');
    }
    //======= Draw || Questions || Lines =======>


    //======= Check || Index || Stop "Quiz" =======>

    stop_Quiz(values:[]) {
        if (this.index > values.length - 1) {
            this.state = false;
        }
    }
    //======= Check || Index || Stop "Quiz" =======>

}

class Checker {
    darwer:DrawUi;
    quest_index_num:HTMLCollection;
    constructor() {
        this.darwer = new DrawUi('./auth/data.json', start);
        this.quest_index_num = quest_index_num.children;
    }

    //======= Check || All ||  Content || Answers =======>
    main_checker(ele:HTMLElement ) {
        const http = new XMLHttpRequest();
        http.onload = () => {
            if (http.status == 200) {
                const data = JSON.parse(http.responseText);
                this.answer_check(data);
                this.line_check(data, ele);
                this.Repeat(data);
            }
        }
        http.open('GET', this.darwer.data, true);
        http.send();
    }
    //======= Check || All ||  Content || Answers =======>

    //======= Set|| All ||  Content || Answers =======>
    set_answers(data:any, state:boolean, statement:boolean) {
        if (state) {
            answers.forEach(ele => {
                if (ele.getAttribute('answer') != data[this.darwer.index].answer) {
                    ele.classList.add('falsey_answer');
                } else {
                    ele.classList.add('correct_answer');
                }
                if (statement) {
                    setTimeout(() => {
                        ele.classList.remove('falsey_answer');
                        ele.classList.remove('correct_answer');
                    }, 1200);
                }
            })
        }
    }
    //======= Set|| All ||  Content || Answers =======>


    //======= Set || All ||  Styles || Answers =======>
    answer_check(data:string) {
        if (this.darwer.index < data.length && this.darwer.index != data.length - 1) {
            this.set_answers(data, true, true);
        } else {
            this.set_answers(data, true, false)
        }
        setTimeout(() => {
            this.darwer.draw();
        }, 1200);
    }
    //======= Set || All ||  Styles || Answers =======>


    //======= Set || All ||  Styles || Answers || Lines =======>

    line_check(data:any, ele:HTMLElement) {
        if (this.darwer.index < data.length) {
            if (ele.getAttribute('answer') == data[this.darwer.index].answer) {
                this.quest_index_num[this.darwer.index].classList.add('correct_answer');
                this.darwer.index++;
            } else {
                this.quest_index_num[this.darwer.index].classList.add('falsey_answer');
                this.darwer.index++;
            }
        }
    }
    //======= Set || All ||  Styles || Answers || Lines =======>

    //======= Reapet_Quiz || =======>
    Repeat(data:[]) {
        if (this.darwer.index == data.length) {
            start_quest.classList.remove('hidde_animate_btn');
            start_quest.innerText = 'Repeat';
            start_quest.addEventListener('click', () => {
                location.reload();
            })
        }
    }
    //======= Reapet_Quiz || =======>
}

class Delet {
    ele;
    data;
    index;
    constructor(ele:HTMLElement, data:string, index:number ) {
        this.ele = ele;
        this.data = data;
        this.index = index;
    }

    swper() {
        if (this.ele.innerText == '0.5') {
            this.get_data();
        } else {
            window.open('https://google.com/')
        }
    }


    get_data() {
        fetch(this.data).then(response => response.json()).then(data => {
            this.delete(data);
        })
    }


    delete(data:any) {
        if (quset_cont.innerText != '') {
            let falsey_data:number[] = [];
            Array.from(answers).filter((ele, index) => {
                if (ele.getAttribute('answer') != data[this.index].answer) {
                    falsey_data.push(index);
                }
            })
            answers[falsey_data[0]].innerText = '';
            answers[falsey_data[1]].innerText = '';
        }
    }
}
//======= Set || classes || =======>



//======= Start || Quiz || App =======>
start_quest.addEventListener('click', start_app);
function start_app(e:any) {

    //======= Audio || Controls =======>
    audio.play()
    audio_cotroll_img[1].classList.remove('active');
    audio_cotroll_img[0].classList.add('active');
    //======= Audio || Controls =======>

    //======= Draw || Ui || Class =======>
    const play = new DrawUi('./auth/data.json', start);
    play.draw();
    //======= Draw || Ui || Class =======>

    //======= Checker || In || Chossen =======>
    const chek = new Checker();
    answers.forEach(ele => {
        ele.addEventListener('click', (e) => {
            chek.main_checker( e.target as HTMLElement);
        })
    })
    //======= Checker || In || Chossen =======>

    //======= Delet || Button || And Event =======>
    e.target.classList.add("hidde_animate_btn");
    e.target.removeEventListener('click', start_app);
    //======= Delet || Button || And Event =======>



    //======= Remove || Two || Answers =======>
    remove_2.addEventListener("click", (e) => {
        const deleter = new Delet(e.target as HTMLElement , chek.darwer.data,chek.darwer.index );
        deleter.swper();
    })
    //======= Remove || Two || Answers =======>

    //======= Searcher || Event =======>
    google.addEventListener("click", (e) => {
        const deleter = new Delet(e.target as HTMLElement , chek.darwer.data,chek.darwer.index );
        deleter.swper();
    })
    //======= Searcher || Event =======>

    //===== Simple || Animate ========>
    quest_index_num.style.padding = '0';
}
//======= Start || Quiz || App =======>


//======= Audio || Controller || App =======>
audio_cotroll_img.forEach(ele => {
    ele.addEventListener('click', () => {
        if (audio.paused) {
            audio_cotroll_img[1].classList.remove('active');
            audio_cotroll_img[0].classList.add('active');
            audio.play();
        } else if (!audio.paused) {
            audio_cotroll_img[1].classList.add('active');
            audio_cotroll_img[0].classList.remove('active');
            audio.pause();
        }
    })
})
//======= Audio || Controller || App =======>


//========= Handel  || Hover  || Effect  || in  || Small  || Deveices ||  ============>
window.addEventListener('resize', () => {
    if (window.innerWidth < 961) {
        const hover = document.querySelectorAll('.hover');
        hover.forEach(ele => {
            ele.classList.add('hover_2');
            ele.classList.remove('hover');
        })
        console.warn('resized to small delet hover');
    } else {
        const hover_2 = document.querySelectorAll('.hover_2');
        hover_2.forEach(ele => {
            ele.classList.add('hover')
            ele.classList.remove('hover_2');
        })
        console.warn('resized to Big add hover');
    }
})
//========= Handel  || Hover  || Effect  || in  || Small  || Deveices ||  ============>