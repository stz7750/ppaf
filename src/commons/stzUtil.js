/**
 *packageName    : stz-
 * fileName       : stzUtil.js
 * author         : stz
 * date           : 7/16/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 7/16/24        stz       최초 생성
 */
export const stzUtil = {

    //ReadME : TimeStamp 형식의 인자값을 받아서 yyyy-mm-dd로 파싱합니다.
    dateFormatTs : (date) => {
        let formatDT = date.split('T');

        return formatDT[0];
    },

    //ReadMe : 문자열 형식의 인자값을 받아서 yyyy.mm.dd로 리턴합니다.
    //param : yyyymmdd
    dateFormatDots :  (date) => {
        let year = date.substring(0, 4);
        let month = date.substring(4, 6);
        let day = date.substring(6, 8);
        return `${year}.${month}.${day}`;
    },

    //ReadMe : 문자열 형식의 인자값을 받아서 yyyy-mm-dd로 리턴합니다
    //Param : yyyymmdd
    dateFormatDash : (date) => {
        let year = date.substring(0, 4);
        let month = date.substring(4, 6);
        let day = date.substring(6, 8);
        return `${year}-${month}-${day}`;
    },

    //ReadME : 문자열 형식의 인자값을 받아서 yyyy/mm/dd로 리턴합니다.
    //param : yyyymmdd
    dateFormatSlashes : (date) => {
        let year = date.substring(0, 4);
        let month = date.substring(4, 6);
        let day = date.substring(6, 8);
        return `${year}/${month}/${day}`;
    },

    //ReadMe : 첫번째 인자 : 배열 , 두번째인자 : 더하고 싶은 배열의 elements의 갯수를 넣어주면 해당 갯수만큼 더해서 새로운 배열로 리턴합니다.
    //Params : Array , Integer
    arrSumByLength : (arr, arrSize) => {
        let result = [];
        for (let i = 0; i < arr.length; i += arrSize) {
            result.push(
                arr
                    .slice(i, i + arrSize)
                    .reduce((sum, val) => sum + val, 0)
                    .toLocaleString()
            );
        }
        return result;
    },

    //ReadMe : (1)data는 트리를 만들어야하는 데이터 배열이 됩니다.
    // (2) idKey는 각 항목의 식별자 키가 됩니다.
    // (3) prentKey는 부모의 key가 됩니다.
    // (4) childrenKey는 자식의 key가 됩니다. 정의하지 않으면 children이 됩니다.
    buildTree :  (data, idKey, parentKey, childrenKey = 'children') => {
        const tree = [];
        const childrenMap = {};

        data.forEach(item => {
            item[childrenKey] = [];
            childrenMap[item[idKey]] = item;

            if (!item[parentKey]) {
                tree.push(item);
            } else {
                const parent = childrenMap[item[parentKey]];
                if (parent) {
                    parent[childrenKey].push(item);
                }
            }
        });

        return tree;
    },

    paginate : (data, page, itemsPerPage) => {
        const offset = (page - 1) * itemsPerPage;
        const paginatedItems = data.slice(offset, offset + itemsPerPage);
        const totalPages = Math.ceil(data.length / itemsPerPage);
        return {
            currentPage: page,
            itemsPerPage,
            totalItems: data.length,
            totalPages,
            data: paginatedItems,
            pages: Array.from({ length: totalPages }, (_, i) => i + 1)
        };
    },

    //ReadMe : (1) 첫번째 인자는 컨텐츠 데이터
    // (2) 새로운 페이지
    // (3) 보여질 항목의 갯수
    // return 자신의 페이지네이션 함수로 해당 값을 리턴 합니다.
    changePage : (data, newPage, itemsPerPage) => {
        return this.paginate(data, newPage, itemsPerPage);
    },

    //ReadMe : 테이블 Dom 객체를 첫번째 인자로 받습니다 ex) ref ,
    // 두번째 인자는 파일명을 결정합니다.
    downloadTableByCSV : (tableElement, filename = 'table_data.csv') => {
        if (!tableElement) {
            console.error('Table element not found.');
            return;
        }

        const rows = Array.from(tableElement.querySelectorAll('tr'));
        const csv = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(cell => `"${cell.textContent}"`).join(',');
        }).join('\n');

        //한글 깨짐이 발생해서 UTF-8 BOM 추가
        const bom = "\uFEFF";
        const csvBlob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    //ReadMe :(1) 인자값을 받아서 두번째 인자값과 패턴비교를 진행합니다.
    // return : Boolean
    containsPattern : (data, pattern) => {
        if (typeof pattern !== 'string') {
            throw new Error('Pattern must be a string');
        }

        // 첫 번째 인자가 숫자인 경우 문자열로 변환
        const dataString = typeof data === 'number' ? data.toString() : data;

        if (typeof dataString !== 'string') {
            throw new Error('에러');
        }

        const regex = new RegExp(pattern);
        return regex.test(dataString);
    },
    //TODO : password , Null Chk , remove Koean , remove Str , remove Num , Plus comma , remove comma

}



export const log = (message) => {
    const style = 'color: blue; font-weight: bold;';
    console.log(`%c${message} :`, style, message);
};

export const error = (message) => {
    return console.error(message);
};

export const table = (data) => {
    return console.table(data);
};