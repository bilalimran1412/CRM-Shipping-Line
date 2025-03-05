import math


def integers_only(text) -> str:
    """
    Removes all symbols except integers
    ex: +998(91) 333 33 33 -> 998913333333
    """
    return ''.join(x for x in text if x.isdigit())


def split_array(array, one_array_len):
    newArray = []
    arrays_count = math.ceil(len(array) / one_array_len)

    for i in range(1, arrays_count + 1):
        newArray.append(array[:one_array_len])
        array = array[one_array_len:]

    return newArray
